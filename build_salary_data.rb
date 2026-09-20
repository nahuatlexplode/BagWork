require "cgi"
require "json"
require "time"

# Rebuild the 2026-27 salary ledger from Basketball-Reference's current
# contract pages. These pages include injured/inactive players and partially
# guaranteed contracts, so availability never determines whether a cap hit is
# counted.
SOURCE_GLOB = "/private/tmp/bref-contracts-*.html"
OUTPUT_PATH = File.join(__dir__, "salary-data.js")
ROSTER_PATH = File.join(__dir__, "roster-data.js")

TEAM_NAME_BY_CODE = {
  "ATL" => "Atlanta Hawks", "BOS" => "Boston Celtics", "BRK" => "Brooklyn Nets",
  "CHO" => "Charlotte Hornets", "CHI" => "Chicago Bulls", "CLE" => "Cleveland Cavaliers",
  "DAL" => "Dallas Mavericks", "DEN" => "Denver Nuggets", "DET" => "Detroit Pistons",
  "GSW" => "Golden State Warriors", "HOU" => "Houston Rockets", "IND" => "Indiana Pacers",
  "LAC" => "LA Clippers", "LAL" => "Los Angeles Lakers", "MEM" => "Memphis Grizzlies",
  "MIA" => "Miami Heat", "MIL" => "Milwaukee Bucks", "MIN" => "Minnesota Timberwolves",
  "NOP" => "New Orleans Pelicans", "NYK" => "New York Knicks", "OKC" => "Oklahoma City Thunder",
  "ORL" => "Orlando Magic", "PHI" => "Philadelphia 76ers", "PHO" => "Phoenix Suns",
  "POR" => "Portland Trail Blazers", "SAC" => "Sacramento Kings", "SAS" => "San Antonio Spurs",
  "TOR" => "Toronto Raptors", "UTA" => "Utah Jazz", "WAS" => "Washington Wizards"
}.freeze

NAME_ALIASES = {
  "jimmybutler" => "jimmybutleriii",
  "nicolasclaxton" => "nicclaxton",
  "herbjones" => "herbertjones",
  "ronhollandii" => "ronaldhollandii",
  "mohamedbamba" => "mobamba",
  "nahshonhyland" => "boneshyland",
  "sviatoslavmykhailiuk" => "svimykhailiuk"
}.freeze

def clean_html(value)
  CGI.unescapeHTML(value.to_s.gsub(/<[^>]+>/, " ").gsub(/\s+/, " ").strip)
end

def normalized_player_name(value)
  value.to_s.unicode_normalize(:nfd).gsub(/\p{Mn}/, "").downcase.gsub(/[^a-z0-9]/, "")
end

def roster_key(value)
  normalized = normalized_player_name(value)
  NAME_ALIASES.fetch(normalized, normalized)
end

roster_source = File.read(ROSTER_PATH)
roster_updated_at = roster_source[/window\.NBA_ROSTER_UPDATED_AT=(".*?");/, 1]
roster_json = roster_source[/window\.NBA_ROSTER_POOL=(\[.*\]);\s*\z/m, 1]
abort "Could not parse #{ROSTER_PATH}" unless roster_json

roster_index = JSON.parse(roster_json).each_with_object({}) do |(id, name, code, position), index|
  index[roster_key(name)] = { "id" => id, "rosterName" => name, "rosterTeam" => code, "position" => position }
end

teams = {}

Dir[SOURCE_GLOB].sort.each do |path|
  code = File.basename(path)[/bref-contracts-([A-Z]+)\.html/, 1]
  team = TEAM_NAME_BY_CODE[code]
  next unless team

  html = File.read(path)
  table = html[/<table[^>]+id="contracts"[^>]*>(.*?)<\/table>/m, 1]
  abort "Missing contracts table for #{team}" unless table

  players = table.scan(/<tbody>(.*?)<\/tbody>/m).flatten.first.to_s.scan(/<tr[^>]*>(.*?)<\/tr>/m).flatten.map do |row|
    player_cell = row[/<th[^>]+data-stat="player"[^>]*>(.*?)<\/th>/m, 1]
    salary_cell = row[/<td[^>]+data-stat="y1"[^>]*>(.*?)<\/td>/m, 1]
    salary = row[/<td[^>]+data-stat="y1"[^>]+csk="(\d+)"[^>]*>/m, 1]
    next unless player_cell && salary

    name = clean_html(player_cell)
    roster_player = roster_index[roster_key(name)] || {}
    future_years = (1..6).count { |year| row.match?(/data-stat="y#{year}"[^>]+csk="\d+"/) }
    guaranteed = !salary_cell.to_s.include?("<em>")

    {
      "name" => name,
      "salary" => salary.to_i,
      "age" => clean_html(row[/<td[^>]+data-stat="age_today"[^>]*>(.*?)<\/td>/m, 1]),
      "term" => future_years > 1 ? "#{future_years} salary years listed" : "Final listed contract year",
      "guaranteed" => guaranteed,
      "availabilityIndependent" => true,
      "basketballReferenceId" => player_cell[/href=['"]\/players\/[^\/]+\/([^.'"]+)\.html/, 1],
      "id" => roster_player["id"],
      "position" => roster_player["position"],
      "contractSourceTeam" => team,
      "currentTeam" => team,
      "contractSourceUrl" => "https://www.basketball-reference.com/contracts/#{code}.html"
    }.compact
  end.compact

  payroll = players.sum { |player| player["salary"] }
  reported_total = table[/<tfoot>.*?data-stat="y1"[^>]*>\$([0-9,]+)<\/td>/m, 1]&.delete(",")&.to_i

  teams[team] = {
    "payroll" => reported_total || payroll,
    "playerSalaryTotal" => payroll,
    "updated" => Time.now.utc.strftime("%Y-%m-%d"),
    "sourceUrl" => "https://www.basketball-reference.com/contracts/#{code}.html",
    "players" => players.sort_by { |player| [-player["salary"], player["name"]] }
  }
end

abort "Expected 30 teams, found #{teams.length}" unless teams.length == 30

meta = {
  "season" => "2026-27",
  "salaryCap" => 164_961_000,
  "taxLine" => 200_428_000,
  "firstApron" => 209_015_000,
  "secondApron" => 221_686_000,
  "officialCapSource" => "https://www.nba.com/news/nba-salary-cap-2026-27-season",
  "salarySource" => "Basketball-Reference contracts",
  "salarySourceUrl" => "https://www.basketball-reference.com/contracts/",
  "salarySourceCadence" => "Updated monthly",
  "rosterSource" => "ESPN NBA team rosters (identity links only)",
  "rosterUpdatedAt" => roster_updated_at ? JSON.parse(roster_updated_at) : nil,
  "contractRows" => teams.values.sum { |data| data["players"].length },
  "generatedAt" => Time.now.utc.iso8601
}

output = <<~JAVASCRIPT
  // 2026-27 team contract ledger from Basketball-Reference's current contract pages.
  // Injured and inactive players remain included because salary is independent of availability.
  // Cap, tax and apron thresholds are from the NBA's official June 30, 2026 release.
  window.BAGWORK_SALARY_META = #{JSON.generate(meta)};
  window.BAGWORK_TEAM_SALARIES = #{JSON.generate(teams)};
  window.BAGWORK_UNASSIGNED_CONTRACTS = [];
JAVASCRIPT

File.write(OUTPUT_PATH, output)
puts "Wrote #{OUTPUT_PATH} with #{teams.length} teams, #{meta["contractRows"]} contract rows, and zero availability-based exclusions."
