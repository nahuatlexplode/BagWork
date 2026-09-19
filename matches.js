const teams=[['Atlanta Hawks',1,'ATL','East'],['Boston Celtics',2,'BOS','East'],['Brooklyn Nets',17,'BKN','East'],['Charlotte Hornets',30,'CHA','East'],['Chicago Bulls',4,'CHI','East'],['Cleveland Cavaliers',5,'CLE','East'],['Detroit Pistons',8,'DET','East'],['Indiana Pacers',11,'IND','East'],['Miami Heat',14,'MIA','East'],['Milwaukee Bucks',15,'MIL','East'],['New York Knicks',18,'NYK','East'],['Orlando Magic',19,'ORL','East'],['Philadelphia 76ers',20,'PHI','East'],['Toronto Raptors',28,'TOR','East'],['Washington Wizards',27,'WAS','East'],['Dallas Mavericks',6,'DAL','West'],['Denver Nuggets',7,'DEN','West'],['Golden State Warriors',9,'GSW','West'],['Houston Rockets',10,'HOU','West'],['LA Clippers',12,'LAC','West'],['Los Angeles Lakers',13,'LAL','West'],['Memphis Grizzlies',29,'MEM','West'],['Minnesota Timberwolves',16,'MIN','West'],['New Orleans Pelicans',3,'NOP','West'],['Oklahoma City Thunder',25,'OKC','West'],['Phoenix Suns',21,'PHX','West'],['Portland Trail Blazers',22,'POR','West'],['Sacramento Kings',23,'SAC','West'],['San Antonio Spurs',24,'SAS','West'],['Utah Jazz',26,'UTA','West']];

let selected=null;
let leagueEvents=[];
let teamEvents=[];
let liveCache=null;
let showAllFutureMatches=false;
let showAllPastMatches=false;
const followingKey='bagwork-following';
const byId=id=>teams.find(team=>team[1]===+id);
const followed=()=>JSON.parse(localStorage.getItem(followingKey)||'[]');
const formatUpdated=value=>new Intl.DateTimeFormat([],{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));

async function loadCache(force=false){
  if(liveCache&&!force)return liveCache;
  const response=await fetch(`live.json?v=${force?Date.now():'1'}`,{cache:'no-store'});
  if(!response.ok)throw new Error('BagWork live cache unavailable');
  liveCache=await response.json();
  return liveCache;
}

function renderPicker(){
  for(const conference of ['East','West']){
    const target=document.getElementById(`${conference.toLowerCase()}Teams`);
    target.innerHTML=teams.filter(team=>team[3]===conference).map(team=>`<button class="team-code ${selected?.[1]===team[1]?'active':''}" data-id="${team[1]}">${team[2]}<span>${followed().includes(team[1])?'★':''}</span></button>`).join('');
  }
  document.querySelectorAll('.team-code').forEach(button=>button.onclick=()=>pickTeam(byId(button.dataset.id)));
}

function renderFollowing(){
  const ids=followed(),section=document.getElementById('following'),wrap=document.getElementById('followingTeams');
  section.hidden=!ids.length;
  wrap.innerHTML=ids.map(id=>{const team=byId(id);return team?`<button data-id="${id}">${team[2]} <span>${team[0]}</span></button>`:''}).join('');
  wrap.querySelectorAll('button').forEach(button=>button.onclick=()=>pickTeam(byId(button.dataset.id)));
}

function toggleFollow(){
  if(!selected)return;
  const ids=followed(),index=ids.indexOf(selected[1]);
  if(index<0)ids.push(selected[1]);else ids.splice(index,1);
  localStorage.setItem(followingKey,JSON.stringify(ids));
  renderPicker();renderFollowing();renderEvents();
}

function teamLogo(team){
  const club=team?.team||team||{},abbr=(club.abbreviation||'nba').toLowerCase();
  return club.logo||club.logos?.find(logo=>logo.rel?.includes('default'))?.href||club.logos?.[0]?.href||`https://a.espncdn.com/i/teamlogos/nba/500/${abbr}.png`;
}

function matchupTeams(clubs,withScore=false){
  return `<div class="preview-clubs">${clubs.map(club=>`<div><img src="${teamLogo(club)}" alt="${club.team?.displayName||club.team?.abbreviation||'NBA'} logo"><span><b>${club.team?.displayName||club.team?.abbreviation||'Team'}${withScore&&club.score!=null?` · ${club.score}`:''}</b><small>${club.records?.[0]?.summary||''}</small></span></div>`).join('')}</div>`;
}

function card(event){
  const clubs=event.competitions?.[0]?.competitors||[],date=new Date(event.date),complete=event.status?.type?.completed;
  const teamsText=clubs.map(team=>`${team.team.abbreviation} ${complete?team.score||'—':''}`).join(' · ');
  return `<button class="game-card" data-event="${event.id}"><span>${complete?'FINAL':'UPCOMING'} · ${event.status?.type?.detail||date.toLocaleDateString()}</span><b>${teamsText||event.name}</b><small>${date.toLocaleString()}</small><i>${complete?'OPEN BOX SCORE →':'VIEW MATCHUP →'}</i></button>`;
}

function scheduleToggle(id,label,count,expanded){
  return count>5?`<button class="expand-schedule" id="${id}">${expanded?'SHOW 5 '+label.toUpperCase():'SHOW ALL '+count+' '+label.toUpperCase()} →</button>`:'';
}

function renderEvents(){
  const scope=document.getElementById('matchScope'),all=selected?teamEvents:leagueEvents,now=Date.now();
  const allFuture=all.filter(event=>!event.status?.type?.completed&&new Date(event.date)>=now).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const allPast=all.filter(event=>event.status?.type?.completed).sort((a,b)=>new Date(b.date)-new Date(a.date));
  const future=showAllFutureMatches?allFuture:allFuture.slice(0,5),past=showAllPastMatches?allPast:allPast.slice(0,5);
  const upcoming=document.getElementById('upcomingMatches'),results=document.getElementById('recentResults');
  scope.textContent=selected?`${selected[2]} · TEAM VIEW`:'ALL 30 TEAMS · NEXT GAMES';
  upcoming.classList.toggle('league-list',!selected&&!showAllFutureMatches);
  results.classList.toggle('league-list',!selected&&!showAllPastMatches);
  upcoming.innerHTML=future.length?future.map(card).join(''):'<div class="empty-card">No future games were returned by the current league schedule.</div>';
  upcoming.insertAdjacentHTML('beforeend',scheduleToggle('showAllFuture','upcoming games',allFuture.length,showAllFutureMatches));
  results.innerHTML=past.length?past.map(card).join(''):'<div class="empty-card">No completed games are available in this view.</div>';
  results.insertAdjacentHTML('beforeend',scheduleToggle('showAllPast','completed games',allPast.length,showAllPastMatches));
  if(selected){
    const wins=allPast.filter(event=>(event.competitions?.[0]?.competitors||[]).find(team=>String(team.team.id)===String(selected[1]))?.winner).length;
    document.getElementById('teamGameAnalysis').innerHTML=`<p class="eyebrow">${selected[2]}</p><h2>${selected[0]} match analysis</h2><p>${allPast.length?`${wins} wins in ${allPast.length} completed games currently indexed.`:'No completed games in this view yet.'} ${allFuture.length} future games are available.</p><button class="dark-btn" id="followSelected">${followed().includes(selected[1])?'★ FOLLOWING':'☆ FOLLOW TEAM'}</button>`;
    document.getElementById('followSelected').onclick=toggleFollow;
  }else{
    document.getElementById('teamGameAnalysis').innerHTML='<p class="eyebrow">LEAGUE VIEW</p><h2>Every team’s schedule.</h2><p>The first five league games stay compact. Expand either list or choose a team code for its full schedule.</p>';
  }
  document.querySelectorAll('[data-event]').forEach(button=>button.onclick=()=>openMatch(button.dataset.event));
  document.getElementById('showAllFuture')?.addEventListener('click',()=>{showAllFutureMatches=!showAllFutureMatches;renderEvents()});
  document.getElementById('showAllPast')?.addEventListener('click',()=>{showAllPastMatches=!showAllPastMatches;renderEvents()});
}

async function fetchTeamSchedule(team){
  const response=await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${team[1]}/schedule?dates=20251001-20270731`,{cache:'no-store'});
  if(!response.ok)throw new Error('schedule unavailable');
  return (await response.json()).events||[];
}

async function pickTeam(team){
  if(!team)return;
  selected=team;showAllFutureMatches=false;showAllPastMatches=false;
  document.getElementById('gameDetail').hidden=true;
  renderPicker();
  document.getElementById('matchStatus').textContent=`Loading ${team[0]} schedule…`;
  try{
    const cache=await loadCache();
    teamEvents=(cache.events||[]).filter(event=>(event.competitions?.[0]?.competitors||[]).some(club=>String(club.team?.id)===String(team[1])||club.team?.abbreviation===team[2]));
    document.getElementById('matchStatus').textContent=`${team[0]} · ${teamEvents.length} games · ${cache.meta.scheduleSource||'ESPN NBA'} · updated ${formatUpdated(cache.meta.updatedAt)}`;
  }catch{
    try{
      teamEvents=await fetchTeamSchedule(team);
      document.getElementById('matchStatus').textContent=`${team[0]} · ${teamEvents.length} games · direct ESPN feed`;
    }catch{teamEvents=[];document.getElementById('matchStatus').textContent=`${team[0]} schedule unavailable`}
  }
  renderEvents();
}

async function loadLeague(force=false){
  selected=null;showAllFutureMatches=false;showAllPastMatches=false;renderPicker();
  document.getElementById('matchStatus').textContent='Loading the trusted league schedule cache…';
  try{
    const cache=await loadCache(force);
    leagueEvents=cache.events||[];
    document.getElementById('matchStatus').textContent=`${leagueEvents.length} NBA games indexed · ${cache.meta.scheduleSource||'ESPN NBA'} · updated ${formatUpdated(cache.meta.updatedAt)}`;
  }catch{
    document.getElementById('matchStatus').textContent='Cache unavailable · requesting ESPN team schedules…';
    try{
      const feeds=await Promise.all(teams.map(team=>fetchTeamSchedule(team).catch(()=>[])));
      const events=new Map();feeds.flat().forEach(event=>events.set(event.id,event));leagueEvents=[...events.values()];
      document.getElementById('matchStatus').textContent=`${leagueEvents.length} NBA games indexed · direct ESPN feed`;
    }catch{leagueEvents=[];document.getElementById('matchStatus').textContent='League schedule unavailable'}
  }
  renderEvents();
}

async function openMatch(id){
  const event=[...leagueEvents,...teamEvents].find(item=>String(item.id)===String(id)),panel=document.getElementById('gameDetail');
  panel.hidden=false;
  if(event&&!event.status?.type?.completed){
    const clubs=event.competitions?.[0]?.competitors||[],name=clubs.map(team=>team.team.displayName).join(' vs. '),date=new Date(event.date);
    panel.innerHTML=`<p class="eyebrow">MATCH PREVIEW · ESPN SCHEDULE</p><h2>${name||event.name}</h2><p>${date.toLocaleString()} · ${event.status?.type?.detail||'Upcoming game'}</p>${matchupTeams(clubs)}<a class="highlight-link" href="https://www.youtube.com/results?search_query=${encodeURIComponent(`${name} preview NBA`)}" target="_blank" rel="noreferrer">SEARCH PREVIEW / ANALYSIS ON YOUTUBE ↗</a>`;
    panel.scrollIntoView({behavior:'smooth',block:'start'});return;
  }
  panel.innerHTML='<p class="eyebrow">ESPN BOXSCORE FEED</p><h2>Loading game detail…</h2>';
  try{
    const response=await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${id}`,{cache:'no-store'});
    if(!response.ok)throw new Error('box score unavailable');
    const data=await response.json(),groups=data.boxscore?.players||[],game=data.header?.competitions?.[0],clubs=game?.competitors||[],title=clubs.map(team=>`${team.team.abbreviation} ${team.score}`).join(' · ')||'Game detail';
    panel.innerHTML=`<p class="eyebrow">ESPN BOXSCORE FEED</p><h2>${title}</h2>${matchupTeams(clubs,true)}<a class="highlight-link" target="_blank" rel="noreferrer" href="https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} FreeDawkins GameTime highlights`)}">SEARCH FREEDAWKINS / GAMETIME HIGHLIGHTS ↗</a><div class="boxscore-grid">${groups.map(group=>`<article><h3>${group.team?.displayName||'Team'}</h3><div class="boxscore-head">PLAYER <span>PTS · REB · AST</span></div>${(group.statistics?.[0]?.athletes||[]).map(player=>`<a href="player.html?player=${encodeURIComponent(player.athlete?.displayName||'Player')}&id=${player.athlete?.id||''}"><b>${player.athlete?.displayName||'Player'}</b><span>${player.stats?.slice(0,3).join(' · ')||'—'}</span></a>`).join('')}</article>`).join('')}</div>`;
  }catch{
    const clubs=event?.competitions?.[0]?.competitors||[];
    panel.innerHTML=`<p class="eyebrow">GAME DETAIL</p><h2>Live box score unavailable.</h2>${matchupTeams(clubs,true)}<p>The cached final remains visible while the detailed ESPN summary feed reconnects.</p>`;
  }
  panel.scrollIntoView({behavior:'smooth',block:'start'});
}

document.getElementById('refreshMatches').onclick=()=>selected?pickTeam(selected):loadLeague(true);
document.getElementById('clearTeam').onclick=()=>loadLeague(false);
renderPicker();renderFollowing();loadLeague();
document.title=document.title.replace(/Courtside IQ/g,'BagWork');
document.querySelectorAll('.brand').forEach(brand=>brand.innerHTML='<span class="brand-mark">B</span><span>BAG<br><b>WORK</b></span>');
