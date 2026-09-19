// Complete player profiles powered by the same roster and stat snapshots as the index.
(function hydratePlayerProfile(){
  const root=document.getElementById('playerProfile');
  if(!root)return;

  const params=new URLSearchParams(location.search);
  const id=params.get('id');
  const requestedName=params.get('player')||'NBA player';
  const roster=Array.isArray(window.NBA_ROSTER_POOL)?window.NBA_ROSTER_POOL:[];
  const rosterPlayer=roster.find(player=>String(player[0])===String(id))||roster.find(player=>player[1]===requestedName);
  const playerId=String(id||rosterPlayer?.[0]||'');
  const playerName=rosterPlayer?.[1]||requestedName;
  const fallbackTeam=rosterPlayer?.[2]||'NBA';
  const fallbackPosition=rosterPlayer?.[3]||'—';
  const stats=window.NBA_STATS_BY_SEASON||{};
  let seasonSelect=document.getElementById('profileSeason');

  function seasonLabel(key){
    if(key==='career')return 'CAREER · WEIGHTED REGULAR-SEASON AVERAGES';
    const end=Number(key),start=end-1;
    return `${start}–${String(end).slice(-2)} SEASON · VERIFIED STAT LINE`;
  }

  function setMeta(label,value){
    document.querySelectorAll('.profile-meta span').forEach(item=>{
      if(item.childNodes[0]?.textContent.trim()===label)item.querySelector('b').textContent=value??'—';
    });
  }

  function percentageValue(value){
    return Number.isFinite(value)&&Math.abs(value)<=1?value*100:value;
  }

  function abilityPoints(line){
    const values=line?.length?[Math.min(10,(line[1]||0)/3.3),Math.min(10,line[3]||0),Math.min(10,(percentageValue(line[7])||0)/5),Math.min(10,line[2]||0),Math.min(10,(line[4]||0)*5),Math.min(10,(line[5]||0)*3)]:[0,0,0,0,0,0];
    return values.map((value,index)=>{
      const angle=-Math.PI/2+index*Math.PI/3,radius=66*(value/10);
      return `${100+Math.cos(angle)*radius},${100+Math.sin(angle)*radius}`;
    }).join(' ');
  }

  function applyStatLine(key){
    const line=stats[key]?.[playerId];
    const values=line?{
      PPG:line[1],RPG:line[2],APG:line[3],SPG:line[4],BPG:line[5],'FG%':percentageValue(line[6]),'3P%':percentageValue(line[7]),
      'IQ IMPACT':line[1]+line[2]*1.25+line[3]*1.5+line[4]*2+line[5]*2
    }:{};
    document.querySelectorAll('.player-stats article').forEach(card=>{
      const label=card.querySelector('span')?.textContent;
      const value=values[label];
      const suffix=label==='FG%'||label==='3P%'?'%':'';
      card.querySelector('b').textContent=Number.isFinite(value)?`${Number(value).toFixed(1)}${suffix}`:'—';
    });
    const eyebrow=document.querySelector('.stat-title .eyebrow');
    if(eyebrow)eyebrow.textContent=seasonLabel(key);
    const games=Number(line?.[0]);
    const state=key==='career'
      ? (games?`CAREER PROFILE · ${games} REGULAR-SEASON GAMES`:'CAREER LINE UNAVAILABLE')
      : (games?`ACTIVE · ${games} GAMES IN SELECTED SEASON`:'NO NBA GAMES IN SELECTED SEASON');
    document.querySelectorAll('.state-pill,.form-panel h2').forEach(item=>item.textContent=item.classList.contains('state-pill')?`● ${state}`:state);
    const dataShape=document.querySelector('.player-ability svg polygon:last-of-type');
    if(dataShape)dataShape.setAttribute('points',abilityPoints(line));
  }

  function setupSeasonMenu(){
    if(!seasonSelect){
      const actions=document.querySelector('.header-actions');
      actions?.insertAdjacentHTML('afterbegin','<select class="season-select" id="profileSeason" aria-label="Player stat season"></select>');
      seasonSelect=document.getElementById('profileSeason');
    }
    if(!seasonSelect)return;
    const requested=params.get('season')||'2026';
    const options=[['2027','2026–27'],['2026','2025–26'],['2025','2024–25'],['2024','2023–24'],['2023','2022–23'],['2022','2021–22'],['career','Career']];
    const clean=seasonSelect.cloneNode(false);
    clean.id='profileSeason';
    clean.className=seasonSelect.className;
    clean.innerHTML=options.map(([value,label])=>`<option value="${value}">${label}</option>`).join('');
    seasonSelect.replaceWith(clean);
    let selected=options.some(([value])=>value===requested)?requested:'2026';
    if(!stats[selected]?.[playerId]){
      const latest=options.map(option=>option[0]).find(key=>stats[key]?.[playerId]);
      if(latest)selected=latest;
    }
    clean.value=selected;
    clean.addEventListener('change',()=>applyStatLine(clean.value));
    applyStatLine(selected);
  }

  function setupPhoto(){
    const photo=document.querySelector('.player-photo');
    if(!photo)return;
    if(!playerId){photo.innerHTML=`<span>${playerName.split(' ').map(part=>part[0]).join('').slice(0,2)}</span>`;return;}
    photo.innerHTML=`<img src="https://a.espncdn.com/i/headshots/nba/players/full/${playerId}.png" alt="Headshot of ${playerName}">`;
    photo.querySelector('img').onerror=()=>{photo.innerHTML=`<span>${playerName.split(' ').map(part=>part[0]).join('').slice(0,2)}</span>`};
  }

  async function loadBio(){
    if(!playerId)return;
    try{
      const cacheResponse=await fetch(`live.json?v=${Date.now()}`,{cache:'no-store'});
      if(!cacheResponse.ok)throw new Error('cache unavailable');
      const cache=await cacheResponse.json();
      let cachedPlayer,cachedTeam;
      for(const team of cache.teams||[]){
        const match=(team.roster||[]).find(player=>String(player.id)===String(playerId));
        if(match){cachedPlayer=match;cachedTeam=team;break}
      }
      if(!cachedPlayer)throw new Error('player missing from cache');
      document.getElementById('playerName').textContent=cachedPlayer.displayName||playerName;
      const heading=document.querySelector('.player-hero h2');if(heading)heading.textContent=cachedPlayer.displayName||playerName;
      const eyebrow=document.querySelector('.player-hero .eyebrow');if(eyebrow)eyebrow.textContent=`${cachedTeam.displayName||fallbackTeam} · ${cachedPlayer.position?.abbreviation||fallbackPosition}`.toUpperCase();
      const bio=document.querySelector('.player-hero .bio');if(bio)bio.textContent=`${cachedPlayer.displayName||playerName} is listed at ${cachedPlayer.displayHeight||'—'}, ${cachedPlayer.displayWeight||'—'} and plays ${cachedPlayer.position?.displayName||fallbackPosition} for the ${cachedTeam.displayName||fallbackTeam}. Roster data updated ${new Date(cache.meta.updatedAt).toLocaleString()}.`;
      setMeta('AGE',cachedPlayer.age);setMeta('HEIGHT',cachedPlayer.displayHeight);setMeta('TEAM',cachedTeam.displayName||fallbackTeam);
      const image=document.querySelector('.player-photo img');if(image&&cachedPlayer.headshot?.href)image.src=cachedPlayer.headshot.href;
      const profileLink=(cachedPlayer.links||[]).find(link=>link.rel?.includes('playercard'));
      const social=document.querySelector('.social-link');if(social&&profileLink){social.href=profileLink.href;social.textContent='VIEW ESPN PLAYER PROFILE ↗'}
      return;
    }catch{}
    try{
      const response=await fetch(`https://site.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${playerId}`,{cache:'no-store'});
      if(!response.ok)throw new Error('profile unavailable');
      const athlete=(await response.json()).athlete;
      if(!athlete)return;
      document.getElementById('playerName').textContent=athlete.displayName||playerName;
      const heading=document.querySelector('.player-hero h2');
      if(heading)heading.textContent=athlete.displayName||playerName;
      const eyebrow=document.querySelector('.player-hero .eyebrow');
      if(eyebrow)eyebrow.textContent=`${athlete.team?.displayName||fallbackTeam} · ${athlete.position?.abbreviation||fallbackPosition}`.toUpperCase();
      const bio=document.querySelector('.player-hero .bio');
      if(bio)bio.textContent=`${athlete.displayName||playerName} is listed at ${athlete.displayHeight||'—'}, ${athlete.displayWeight||'—'} and plays ${athlete.position?.displayName||fallbackPosition} for the ${athlete.team?.displayName||fallbackTeam}.`;
      setMeta('AGE',athlete.age);
      setMeta('HEIGHT',athlete.displayHeight);
      setMeta('TEAM',athlete.team?.displayName||fallbackTeam);
      const image=document.querySelector('.player-photo img');
      if(image&&athlete.headshot?.href)image.src=athlete.headshot.href;
      const profileLink=(athlete.links||[]).find(link=>link.rel?.includes('playercard'));
      const social=document.querySelector('.social-link');
      if(social&&profileLink){social.href=profileLink.href;social.textContent='VIEW ESPN PLAYER PROFILE ↗'}
    }catch{
      const eyebrow=document.querySelector('.player-hero .eyebrow');
      if(eyebrow)eyebrow.textContent=`${fallbackTeam} · ${fallbackPosition}`;
      setMeta('TEAM',fallbackTeam);
    }
  }

  document.getElementById('playerName').textContent=playerName;
  const heading=document.querySelector('.player-hero h2');
  if(heading)heading.textContent=playerName;
  const eyebrow=document.querySelector('.player-hero .eyebrow');
  if(eyebrow)eyebrow.textContent=`${fallbackTeam} · ${fallbackPosition}`;
  const bio=document.querySelector('.player-hero .bio');
  if(bio)bio.textContent='Season and career production are loaded from BagWork’s verified regular-season data snapshot.';
  setMeta('TEAM',fallbackTeam);
  setupPhoto();
  setupSeasonMenu();
  loadBio();
})();
