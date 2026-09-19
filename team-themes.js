// Franchise palettes for every NBA team profile.
const BAGWORK_TEAM_THEMES={
  'Atlanta Hawks':['#e03a3e','#fdb927'],'Boston Celtics':['#007a33','#ba9653'],'Brooklyn Nets':['#111111','#a7a9ac'],'Charlotte Hornets':['#00788c','#1d1160'],'Chicago Bulls':['#ce1141','#111111'],'Cleveland Cavaliers':['#6f263d','#fdbb30'],'Dallas Mavericks':['#00538c','#b8c4ca'],'Denver Nuggets':['#0e2240','#fec524'],'Detroit Pistons':['#c8102e','#1d42ba'],'Golden State Warriors':['#1d428a','#ffc72c'],'Houston Rockets':['#ce1141','#000000'],'Indiana Pacers':['#002d62','#fdbb30'],'LA Clippers':['#c8102e','#1d428a'],'Los Angeles Lakers':['#552583','#fdb927'],'Memphis Grizzlies':['#5d76a9','#12173f'],'Miami Heat':['#98002e','#f9a01b'],'Milwaukee Bucks':['#00471b','#eee1c6'],'Minnesota Timberwolves':['#0c2340','#78be20'],'New Orleans Pelicans':['#0c2340','#c8102e'],'New York Knicks':['#006bb6','#f58426'],'Oklahoma City Thunder':['#007ac1','#ef3b24'],'Orlando Magic':['#0077c0','#c4ced4'],'Philadelphia 76ers':['#006bb6','#ed174c'],'Phoenix Suns':['#1d1160','#e56020'],'Portland Trail Blazers':['#e03a3e','#000000'],'Sacramento Kings':['#5a2d81','#63727a'],'San Antonio Spurs':['#000000','#c4ced4'],'Toronto Raptors':['#ce1141','#000000'],'Utah Jazz':['#002b5c','#f9a01b'],'Washington Wizards':['#002b5c','#e31837']
};
(function applyTeamTheme(){
  if(!document.getElementById('teamProfile'))return;
  const team=new URLSearchParams(location.search).get('team')||'Philadelphia 76ers';
  const colors=BAGWORK_TEAM_THEMES[team]||['#315eea','#8a45d6'];
  document.body.classList.add('team-themed');
  document.body.style.setProperty('--team-primary',colors[0]);
  document.body.style.setProperty('--team-secondary',colors[1]);
})();
