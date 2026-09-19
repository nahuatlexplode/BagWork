#!/usr/bin/env python3
"""Build BagWork's same-origin NBA data cache from credible ESPN league feeds.

The generated files are static and safe for GitHub Pages. Browsers read the cache
from the same origin, avoiding CORS failures and API bursts from every visitor.
"""

import argparse
import concurrent.futures
import datetime as dt
import json
import re
import ssl
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


ESPN_SITE = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba"
ESPN_CORE = "https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba"
NBA_SCHEDULE = "https://cdn.nba.com/static/json/staticData/scheduleLeagueV2_1.json"
USER_AGENT = "BagWork/1.0 (+https://github.com/nahuatlexplode/BagWork)"


def fetch_json(url, attempts=3):
    error = None
    for attempt in range(attempts):
        try:
            request = urllib.request.Request(
                url,
                headers={"User-Agent": USER_AGENT, "Accept": "application/json"},
            )
            with urllib.request.urlopen(request, timeout=40) as response:
                return json.loads(response.read().decode("utf-8"))
        except (urllib.error.URLError, urllib.error.HTTPError, ValueError) as exc:
            error = exc
            # Some local macOS Python installs lack the system CA bundle. Only
            # permit this fallback for the two hard-coded ESPN API hosts.
            host = urllib.parse.urlparse(url).hostname
            if "CERTIFICATE_VERIFY_FAILED" in str(exc) and host in {
                "site.api.espn.com", "sports.core.api.espn.com", "cdn.nba.com"
            }:
                try:
                    with urllib.request.urlopen(request, timeout=40, context=ssl._create_unverified_context()) as response:
                        return json.loads(response.read().decode("utf-8"))
                except (urllib.error.URLError, urllib.error.HTTPError, ValueError) as fallback_exc:
                    error = fallback_exc
            if attempt + 1 < attempts:
                time.sleep(1.5 * (attempt + 1))
    raise RuntimeError("Feed failed: {} ({})".format(url, error))


def athlete_id(reference):
    match = re.search(r"/athletes/(\d+)", reference or "")
    return match.group(1) if match else None


def compact_team(team):
    return {
        "id": str(team.get("id", "")),
        "displayName": team.get("displayName") or team.get("name") or "NBA Team",
        "abbreviation": team.get("abbreviation") or "NBA",
        "logo": (team.get("logo") or team.get("logos", [{}])[0].get("href") or ""),
    }


def compact_competitor(competitor):
    team = compact_team(competitor.get("team") or {})
    return {
        "id": str(competitor.get("id") or team["id"]),
        "homeAway": competitor.get("homeAway"),
        "winner": bool(competitor.get("winner")),
        "score": competitor.get("score"),
        "records": [
            {"summary": item.get("summary", "")}
            for item in (competitor.get("records") or [])[:1]
        ],
        "team": team,
    }


def compact_event(event):
    competition = (event.get("competitions") or [{}])[0]
    status_type = (event.get("status") or {}).get("type") or {}
    return {
        "id": str(event.get("id", "")),
        "date": event.get("date"),
        "name": event.get("name"),
        "shortName": event.get("shortName"),
        "status": {
            "type": {
                "completed": bool(status_type.get("completed")),
                "detail": status_type.get("detail") or status_type.get("shortDetail") or "",
                "name": status_type.get("name") or "",
            }
        },
        "competitions": [
            {
                "venue": {"fullName": (competition.get("venue") or {}).get("fullName", "")},
                "competitors": [
                    compact_competitor(item)
                    for item in (competition.get("competitors") or [])
                ],
            }
        ],
    }


def compact_player(player):
    return {
        "id": str(player.get("id", "")),
        "displayName": player.get("displayName") or player.get("fullName") or "NBA Player",
        "age": player.get("age"),
        "displayHeight": player.get("displayHeight"),
        "displayWeight": player.get("displayWeight"),
        "position": {
            "abbreviation": (player.get("position") or {}).get("abbreviation") or "—",
            "displayName": (player.get("position") or {}).get("displayName") or "",
        },
        "headshot": {"href": (player.get("headshot") or {}).get("href", "")},
        "status": (player.get("status") or {}).get("name") or "Active",
        "injuries": [
            {
                "status": item.get("status"),
                "type": item.get("type", {}).get("description") if isinstance(item.get("type"), dict) else item.get("type"),
                "details": item.get("details", {}).get("detail") if isinstance(item.get("details"), dict) else item.get("details"),
            }
            for item in (player.get("injuries") or [])
        ],
        "links": [
            {"href": link.get("href"), "rel": link.get("rel") or []}
            for link in (player.get("links") or [])
            if link.get("href")
        ],
    }


def load_team(team):
    team_id = str(team["id"])
    roster_url = "{}/teams/{}/roster".format(ESPN_SITE, team_id)
    depth_url = "{}/teams/{}/depthcharts".format(ESPN_SITE, team_id)
    schedule_url = "{}/teams/{}/schedule?dates=20251001-20270731".format(ESPN_SITE, team_id)
    roster_data = fetch_json(roster_url)
    try:
        depth_data = fetch_json(depth_url)
    except RuntimeError:
        depth_data = {}
    schedule_data = fetch_json(schedule_url)
    coach_data = roster_data.get("coach") or {}
    if isinstance(coach_data, list):
        coach_data = coach_data[0] if coach_data else {}

    positions = ((depth_data.get("depthchart") or [{}])[0].get("positions") or {})
    starters = []
    for position in ("pg", "sg", "sf", "pf", "c"):
        entry = ((positions.get(position) or {}).get("athletes") or [])
        if entry:
            starters.append({
                "id": str(entry[0].get("id", "")),
                "displayName": entry[0].get("displayName") or entry[0].get("fullName"),
                "position": position.upper(),
            })

    team_payload = compact_team(roster_data.get("team") or team)
    team_payload.update({
        "coach": coach_data.get("displayName") or coach_data.get("fullName") or "",
        "roster": [compact_player(player) for player in (roster_data.get("athletes") or [])],
        "starters": starters,
        "source": roster_url,
    })
    return team_payload, [compact_event(event) for event in (schedule_data.get("events") or [])]


def get_teams():
    payload = fetch_json("{}/teams?limit=100".format(ESPN_SITE))
    entries = (((payload.get("sports") or [{}])[0].get("leagues") or [{}])[0].get("teams") or [])
    teams = [entry.get("team") or entry for entry in entries]
    return [team for team in teams if team.get("id")]


def get_news():
    payload = fetch_json("{}/news?limit=36".format(ESPN_SITE))
    articles = []
    for article in payload.get("articles") or []:
        web_link = ((article.get("links") or {}).get("web") or {}).get("href")
        articles.append({
            "id": str(article.get("id", "")),
            "headline": article.get("headline"),
            "description": article.get("description"),
            "published": article.get("published") or article.get("lastModified"),
            "source": "ESPN",
            "images": [{"url": image.get("url")} for image in (article.get("images") or [])[:1]],
            "links": {"web": {"href": web_link}},
        })
    return articles


def get_official_nba_schedule():
    """Return NBA.com's official schedule in the event shape used by the UI."""
    payload = fetch_json(NBA_SCHEDULE, attempts=2)
    schedule = payload.get("leagueSchedule") or payload.get("schedule") or {}
    games = []
    for game_date in schedule.get("gameDates") or []:
        games.extend(game_date.get("games") or [])
    events = []
    for game in games:
        home = game.get("homeTeam") or {}
        away = game.get("awayTeam") or {}
        status = int(game.get("gameStatus") or 0)
        def nba_team(team, home_away):
            abbreviation = team.get("teamTricode") or "NBA"
            return {
                "id": str(team.get("teamId") or ""),
                "homeAway": home_away,
                "winner": bool(status == 3 and int(team.get("score") or 0) > int((away if team is home else home).get("score") or 0)),
                "score": str(team.get("score") or ""),
                "records": [],
                "team": {
                    "id": str(team.get("teamId") or ""),
                    "displayName": "{} {}".format(team.get("teamCity", ""), team.get("teamName", "")).strip(),
                    "abbreviation": abbreviation,
                    "logo": "https://a.espncdn.com/i/teamlogos/nba/500/{}.png".format(abbreviation.lower()),
                },
            }
        events.append({
            "id": str(game.get("gameId") or ""),
            "date": game.get("gameDateTimeUTC") or game.get("gameDateTimeEst"),
            "name": "{} at {}".format(away.get("teamTricode", "Away"), home.get("teamTricode", "Home")),
            "shortName": "{} @ {}".format(away.get("teamTricode", "Away"), home.get("teamTricode", "Home")),
            "status": {"type": {"completed": status == 3, "detail": game.get("gameStatusText") or "Scheduled", "name": str(status)}},
            "competitions": [{"venue": {"fullName": (game.get("arenaName") or "")}, "competitors": [nba_team(home, "home"), nba_team(away, "away")]}],
        })
    if len(events) < 100:
        raise RuntimeError("NBA.com schedule returned only {} games".format(len(events)))
    return events


def parse_existing_stats(path):
    if not path.exists():
        return {}
    source = path.read_text(encoding="utf-8")
    match = re.search(r"window\.NBA_STATS_BY_SEASON=(\{.*\});\s*$", source, re.S)
    return json.loads(match.group(1)) if match else {}


def get_season_stats(season):
    url = "{}/seasons/{}/types/2/leaders?lang=en&region=us&limit=1000".format(ESPN_CORE, season)
    payload = fetch_json(url, attempts=2)
    categories = {item.get("name"): item.get("leaders") or [] for item in payload.get("categories") or []}
    if not categories.get("pointsPerGame"):
        return None

    aliases = {
        "pointsPerGame": 1,
        "reboundsPerGame": 2,
        "assistsPerGame": 3,
        "stealsPerGame": 4,
        "blocksPerGame": 5,
        "fieldGoalPercentage": 6,
        "3PointPct": 7,
    }
    rows = {}
    for category, index in aliases.items():
        for leader in categories.get(category, []):
            player_id = athlete_id((leader.get("athlete") or {}).get("$ref"))
            if not player_id:
                continue
            rows.setdefault(player_id, [0, None, None, None, None, None, None, None])
            value = leader.get("value")
            if value is not None:
                numeric_value = float(value)
                if category == "3PointPct" and abs(numeric_value) <= 1:
                    numeric_value *= 100
                rows[player_id][index] = round(numeric_value, 2)

    totals = {}
    for leader in categories.get("points", []):
        player_id = athlete_id((leader.get("athlete") or {}).get("$ref"))
        if player_id and leader.get("value") is not None:
            totals[player_id] = float(leader["value"])
    for player_id, row in rows.items():
        if row[1] and player_id in totals:
            row[0] = int(round(totals[player_id] / row[1]))
    return rows


def write_stats(path, updated_at, seasons):
    existing = parse_existing_stats(path)
    updated = []
    for season in seasons:
        try:
            rows = get_season_stats(season)
        except RuntimeError as exc:
            print("Stats warning:", exc)
            rows = None
        if rows:
            existing[str(season)] = rows
            updated.append(str(season))
    source = (
        "// ESPN aggregate regular-season statistics cache for BagWork.\n"
        "window.NBA_STATS_UPDATED_AT={};\n"
        "window.NBA_STATS_SOURCE={};\n"
        "window.NBA_STATS_BY_SEASON={};\n"
    ).format(
        json.dumps(updated_at),
        json.dumps("ESPN NBA aggregate leaders"),
        json.dumps(existing, separators=(",", ":"), ensure_ascii=False),
    )
    path.write_text(source, encoding="utf-8")
    return updated


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="live.json")
    parser.add_argument("--roster-js", default="roster-data.js")
    parser.add_argument("--depth-js", default="depth-data.js")
    parser.add_argument("--stats-js", default="stats-data.js")
    parser.add_argument("--skip-stats", action="store_true")
    args = parser.parse_args()

    now = dt.datetime.now(dt.timezone.utc).replace(microsecond=0)
    updated_at = now.isoformat().replace("+00:00", "Z")
    teams = get_teams()
    team_results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(load_team, team) for team in teams]
        for future in concurrent.futures.as_completed(futures):
            try:
                team_results.append(future.result())
            except Exception as exc:
                print("Team warning:", exc)

    team_payloads = sorted((result[0] for result in team_results), key=lambda item: item["displayName"])
    events_by_id = {}
    for _, events in team_results:
        for event in events:
            if event.get("id"):
                events_by_id[event["id"]] = event
    schedule_source = "ESPN NBA schedules"
    try:
        official_events = get_official_nba_schedule()
        events = sorted(official_events, key=lambda item: item.get("date") or "")
        schedule_source = "NBA.com official schedule"
    except Exception as exc:
        print("Official schedule warning:", exc)
        events = sorted(events_by_id.values(), key=lambda item: item.get("date") or "")
    news = get_news()

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    live_payload = {
        "meta": {
            "updatedAt": updated_at,
            "refreshCadenceMinutes": 120,
            "source": "ESPN NBA",
            "sourceUrl": "https://www.espn.com/nba/",
            "scheduleSource": schedule_source,
            "scheduleSourceUrl": NBA_SCHEDULE if schedule_source.startswith("NBA.com") else "https://www.espn.com/nba/schedule",
            "rosteredPlayers": sum(len(team["roster"]) for team in team_payloads),
            "teams": len(team_payloads),
            "games": len(events),
            "headlines": len(news),
        },
        "teams": team_payloads,
        "events": events,
        "news": news,
    }
    output.write_text(json.dumps(live_payload, separators=(",", ":"), ensure_ascii=False), encoding="utf-8")

    roster_pool = []
    depth_snapshot = {}
    for team in team_payloads:
        abbreviation = team["abbreviation"]
        for player in team["roster"]:
            roster_pool.append([player["id"], player["displayName"], abbreviation, player["position"]["abbreviation"]])
        if len(team["starters"]) == 5:
            depth_snapshot[team["displayName"]] = [
                [player["id"], player["displayName"], player["position"]]
                for player in team["starters"]
            ]

    Path(args.roster_js).write_text(
        "// ESPN NBA active-roster cache generated automatically.\n"
        "window.NBA_ROSTER_UPDATED_AT={};\nwindow.NBA_ROSTER_SOURCE={};\nwindow.NBA_ROSTER_POOL={};\n".format(
            json.dumps(updated_at),
            json.dumps("ESPN NBA team rosters"),
            json.dumps(roster_pool, separators=(",", ":"), ensure_ascii=False),
        ),
        encoding="utf-8",
    )
    Path(args.depth_js).write_text(
        "// ESPN NBA projected depth-chart cache generated automatically.\n"
        "window.NBA_DEPTH_UPDATED_AT={};\nwindow.NBA_DEPTH_SOURCE={};\nwindow.NBA_DEPTH_SNAPSHOT={};\n".format(
            json.dumps(updated_at),
            json.dumps("ESPN NBA projected depth charts"),
            json.dumps(depth_snapshot, separators=(",", ":"), ensure_ascii=False),
        ),
        encoding="utf-8",
    )

    stats_updated = []
    if not args.skip_stats:
        stats_updated = write_stats(Path(args.stats_js), updated_at, [now.year + 1, now.year])
    print(json.dumps({
        "updatedAt": updated_at,
        "teams": len(team_payloads),
        "players": len(roster_pool),
        "games": len(events),
        "news": len(news),
        "statSeasonsUpdated": stats_updated,
    }, indent=2))


if __name__ == "__main__":
    main()
