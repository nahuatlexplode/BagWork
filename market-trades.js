const tradeScenarios=[
  {
    id:'lebron-phi',kind:'official',status:'OFFICIAL SIGNING',completed:'July 27, 2026',moveLabel:'FREE-AGENT SIGNING',verified:'September 17, 2026',player:'LeBron James',playerId:'1966',from:'Los Angeles Lakers',fromAbbr:'lal',to:'Philadelphia 76ers',toAbbr:'phi',fit:9,timeline:'Win-now',cost:'No trade assets',
    headline:'LeBron is officially a Philadelphia 76er.',
    summary:'Philadelphia signed James in free agency after his Lakers tenure ended. This was not a trade: Los Angeles did not receive players or draft compensation from Philadelphia.',
    acquiring:['LeBron James','Primary playmaking','Playoff decision-making'],
    returnFramework:['No players sent to Los Angeles','No draft picks sent to Los Angeles','Roster spot and salary commitment only'],
    wins:['Gives Philadelphia another elite organizer beside Tyrese Maxey.','Adds transition passing and late-clock control to a star-heavy lineup.','Creates a flexible frontcourt with Joel Embiid and Jaylen Brown.'],
    risks:['Age and availability remain the largest basketball variables.','A star-heavy rotation must still protect shooting and point-of-attack defense.','The coaching staff must manage touches and regular-season workload.'],
    hurdle:'The transaction is complete. Philadelphia’s challenge is now workload management, lineup balance, and keeping enough defensive speed around its veteran stars.',
    verdict:'A completed, high-upside free-agent signing—not a proposed trade. BagWork now treats James as a Philadelphia player throughout the site.',
    sources:[['76ers official announcement','https://www.nba.com/sixers/news/philadelphia-76ers-sign-4x-nba-champion-and-22x-all-star-lebron-james'],['NBA.com transaction report','https://www.nba.com/news/lebron-james-free-agency-sixers-2026']]
  },
  {
    id:'brown-phi',kind:'official',status:'COMPLETED TRADE',completed:'July 6, 2026',moveLabel:'OFFICIAL TRADE',verified:'September 17, 2026',player:'Jaylen Brown',playerId:'3917376',from:'Boston Celtics',fromAbbr:'bos',to:'Philadelphia 76ers',toAbbr:'phi',fit:9,timeline:'Two-way contention',cost:'George + 4 picks',
    headline:'Philadelphia officially acquired a championship two-way wing.',
    summary:'The 76ers acquired Brown from Boston for Paul George, two first-round picks and two second-round picks. Brown is now part of Philadelphia’s core; George is now a Celtic.',
    acquiring:['Jaylen Brown','Point-of-attack wing defense','Transition scoring and rim pressure'],
    returnFramework:['Paul George','2028 and 2031 first-round picks','2028 and 2030 second-round picks'],
    wins:['Adds a durable wing creator without sacrificing defensive size.','Reduces the burden on Philadelphia’s guards in physical playoff series.','Scales cleanly beside Joel Embiid, Tyrese Maxey and LeBron James.'],
    risks:['The four-pick cost reduces Philadelphia’s future flexibility.','The new core carries major salary and availability risk.','Boston can still benefit if George is healthy and the picks appreciate.'],
    hurdle:'The transaction is complete. Philadelphia must now turn an expensive star group into a coherent rotation, while Boston integrates George and manages the acquired draft capital.',
    verdict:'A completed blockbuster with clear two-way logic for Philadelphia and meaningful present-plus-future value for Boston.',
    sources:[['NBA.com trade report','https://www.nba.com/news/reports-sixers-to-acquire-jaylen-brown-from-celtics'],['NBA.com offseason trade tracker','https://www.nba.com/news/2026-offseason-trade-tracker']]
  },
  {
    id:'giannis-mia',kind:'official',status:'COMPLETED TRADE',completed:'July 6, 2026',moveLabel:'OFFICIAL TRADE',verified:'September 18, 2026',player:'Giannis Antetokounmpo',playerId:'3032977',from:'Milwaukee Bucks',fromAbbr:'mil',to:'Miami Heat',toAbbr:'mia',fit:10,timeline:'Title-or-bust',cost:'4 players + 8 assets',
    headline:'Miami landed the offseason’s biggest star move.',
    summary:'Miami acquired Giannis Antetokounmpo and Bobby Portis from Milwaukee. The Bucks received Tyler Herro, Kel’el Ware, Jaime Jaquez Jr., Kasparas Jakučionis, the No. 13 pick, two future firsts, a first-round swap and a second-round pick.',
    acquiring:['Giannis Antetokounmpo','Bobby Portis','A new championship centerpiece'],
    returnFramework:['Tyler Herro, Kel’el Ware, Jaime Jaquez Jr. and Kasparas Jakučionis','2026 No. 13 pick plus 2031 and 2033 first-rounders','2030 first-round swap and 2033 second-rounder'],
    wins:['Pairs the league’s most forceful rim attacker with Bam Adebayo and Miami’s defensive infrastructure.','Creates overwhelming transition and paint pressure.','Portis supplies needed shooting and frontcourt depth.'],
    risks:['Miami surrendered four rotation players and a deep package of draft control.','Giannis and Bam lineups demand reliable shooting around them.','Guard creation is thinner after moving Herro.'],
    hurdle:'Miami must build enough shooting and half-court organization around a powerful but paint-heavy frontcourt without many premium assets left.',
    verdict:'The league’s clearest title-swinging transaction: enormous upside, enormous asset cost, and a roster that must now be optimized around Giannis immediately.',
    sources:[['NBA.com official offseason trade tracker','https://www.nba.com/news/2026-offseason-trade-tracker']]
  },
  {
    id:'kawhi-tor',kind:'official',status:'COMPLETED TRADE',completed:'September 14, 2026',moveLabel:'OFFICIAL TRADE',verified:'September 18, 2026',player:'Kawhi Leonard',playerId:'6450',from:'LA Clippers',fromAbbr:'lac',to:'Toronto Raptors',toAbbr:'tor',fit:8,timeline:'Veteran contention',cost:'Ingram, Dick + 5 assets',
    headline:'Kawhi returned to Toronto in a late-offseason blockbuster.',
    summary:'Toronto acquired Leonard. The Clippers received Brandon Ingram, Gradey Dick, first-rounders in 2031 and 2033, second-rounders in 2030 and 2033, and a 2027 first-round swap.',
    acquiring:['Kawhi Leonard','Elite playoff shot creation','A proven two-way closer'],
    returnFramework:['Brandon Ingram and Gradey Dick','2031 and 2033 first-round picks','2030 and 2033 seconds plus a 2027 first-round swap'],
    wins:['Gives Toronto a high-leverage half-court scorer with championship history in the city.','Adds a large wing defender who can close games.','Raises the Raptors’ playoff ceiling immediately.'],
    risks:['Availability remains the defining variable.','Toronto paid substantial young talent and future draft capital.','The rotation needs enough shooting and regular-season creation when Leonard rests.'],
    hurdle:'Toronto must keep Leonard healthy without losing enough regular-season games to compromise playoff positioning.',
    verdict:'A high-risk reunion with a real contention payoff; the deal is successful only if Leonard is available for the postseason.',
    sources:[['NBA.com official Kawhi trade ledger','https://www.nba.com/news/2026-offseason-trade-tracker']]
  },
  {
    id:'lamelo-min',kind:'official',status:'COMPLETED 4-TEAM TRADE',completed:'July 10, 2026',moveLabel:'OFFICIAL TRADE',verified:'September 18, 2026',player:'LaMelo Ball',playerId:'4432816',from:'Charlotte Hornets',fromAbbr:'cha',to:'Minnesota Timberwolves',toAbbr:'min',fit:8,timeline:'Creation upgrade',cost:'Reid + major draft value',
    headline:'Minnesota added elite passing in a four-team roster reset.',
    summary:'Minnesota received LaMelo Ball, Josh Green and Isaiah Evans. Charlotte received Naz Reid, Mouhamed Gueye, a 2033 first, three first-round swaps, three seconds and Matteo Spagnolo’s draft rights.',
    acquiring:['LaMelo Ball','Josh Green','Isaiah Evans'],
    returnFramework:['Naz Reid and Mouhamed Gueye','2033 first-round pick and three first-round swaps','Three second-round picks plus Matteo Spagnolo’s rights'],
    wins:['Adds the passing and transition creation Minnesota lacked.','Creates easier offense for Anthony Edwards and Rudy Gobert.','Ball’s size allows more flexible guard combinations.'],
    risks:['The price includes a valuable big and extensive future control.','Ball’s health and defensive focus remain key variables.','Minnesota must balance two high-usage perimeter creators.'],
    hurdle:'The Wolves need Ball and Edwards to share initiation cleanly while maintaining the defensive identity that made the roster dangerous.',
    verdict:'A bold offensive-ceiling trade whose value depends on availability and whether the new backcourt can preserve Minnesota’s defensive standard.',
    sources:[['NBA.com official 4-team trade details','https://www.nba.com/news/2026-offseason-trade-tracker']]
  },
  {
    id:'morant-por',kind:'official',status:'COMPLETED TRADE',completed:'June 29, 2026',moveLabel:'OFFICIAL TRADE',verified:'September 18, 2026',player:'Ja Morant',playerId:'4279888',from:'Memphis Grizzlies',fromAbbr:'mem',to:'Portland Trail Blazers',toAbbr:'por',fit:8,timeline:'Franchise reset',cost:'Grant + Murray',
    headline:'Portland acquired a new lead guard without sending draft picks.',
    summary:'The Trail Blazers acquired Ja Morant from Memphis for Jerami Grant and Kris Murray, reshaping both teams around very different timelines.',
    acquiring:['Ja Morant','Primary creation and rim pressure','A new face for Portland’s offense'],
    returnFramework:['Jerami Grant','Kris Murray','Immediate frontcourt depth for Memphis'],
    wins:['Gives Portland a proven advantage creator in his prime.','The outgoing package did not include reported draft compensation.','Morant’s downhill game can unlock young shooters and centers.'],
    risks:['Availability and off-court reliability matter as much as basketball fit.','Portland already has young guards who need developmental touches.','Spacing around Morant must be carefully protected.'],
    hurdle:'Portland must define the guard hierarchy and build reliable shooting around Morant without slowing the development of its young core.',
    verdict:'An aggressive talent bet at a surprisingly manageable acquisition price, with the largest risk concentrated in availability and roster fit.',
    sources:[['NBA.com official Morant trade details','https://www.nba.com/news/2026-offseason-trade-tracker']]
  },
  {
    id:'kessler-lal',kind:'official',status:'COMPLETED SIGN-AND-TRADE',completed:'July 8, 2026',moveLabel:'OFFICIAL TRADE',verified:'September 18, 2026',player:'Walker Kessler',playerId:'4433136',from:'Utah Jazz',fromAbbr:'uta',to:'Los Angeles Lakers',toAbbr:'lal',fit:9,timeline:'Luka-era anchor',cost:'2 firsts + 2 swaps',
    headline:'The Lakers paid premium draft control for their long-term center.',
    summary:'Los Angeles acquired Kessler in a sign-and-trade. Utah received unprotected first-round picks in 2031 and 2033 plus first-round swaps in 2028 and 2030.',
    acquiring:['Walker Kessler','Rim protection and rebounding','Vertical spacing for Luka Dončić'],
    returnFramework:['Unprotected 2031 first-round pick','Unprotected 2033 first-round pick','First-round swaps in 2028 and 2030'],
    wins:['Provides the rim-running and shot-blocking center archetype that fits Dončić.','Stabilizes the defense behind a scoring-focused backcourt.','Kessler’s age aligns with the Lakers’ new timeline.'],
    risks:['Two unprotected firsts and two swaps are a major long-horizon commitment.','Non-shooting centers can face matchup pressure in the playoffs.','Los Angeles has less draft flexibility for the next star-level opportunity.'],
    hurdle:'Kessler must be good enough in playoff space to justify the Lakers placing four future first-round outcomes at risk.',
    verdict:'An excellent basketball fit purchased at an aggressive price; the deal is a bet that Kessler becomes a playoff-proof defensive anchor.',
    sources:[['NBA.com official sign-and-trade details','https://www.nba.com/news/2026-offseason-trade-tracker']]
  },
  {
    id:'monk-orl',player:'Malik Monk',playerId:'3136776',from:'Sacramento Kings',fromAbbr:'sac',to:'Orlando Magic',toAbbr:'orl',realism:5,fit:8,timeline:'Prime-years upgrade',cost:'High',
    headline:'A live-dribble creator for Orlando’s half-court offense.',
    summary:'Monk would give Orlando pull-up shooting, pick-and-roll creation, and a reliable second-side attacker—skills that make the floor easier for its large forwards.',
    acquiring:['Malik Monk','Second-unit creation','Pull-up shooting and pace'],
    returnFramework:['Rotation salary that keeps Orlando’s core intact','A protected first or young-player value','A replacement guard or flexible asset for Sacramento'],
    wins:['Punishes defenses that load up on Orlando’s primary forwards.','Can start or lead bench units without changing the team’s identity.','Adds shooting gravity while keeping athleticism on the floor.'],
    risks:['Size can be targeted in certain playoff matchups.','A large asset price would be difficult to justify for a non-star.','Orlando still needs enough low-usage shooting around him.'],
    hurdle:'The key question is price: Orlando should not sacrifice a premium defensive piece or unprotected draft value for a secondary creator.',
    verdict:'Strong, logical fit if the price stays in the protected-pick and rotation-player range.'
  },
  {
    id:'allen-mem',player:'Jarrett Allen',playerId:'4066328',from:'Cleveland Cavaliers',fromAbbr:'cle',to:'Memphis Grizzlies',toAbbr:'mem',realism:4,fit:7,timeline:'Interior reset',cost:'High',
    headline:'Reliable rim protection and vertical spacing for Memphis.',
    summary:'Allen would restore a dependable screen-and-dive center who protects the paint and finishes efficiently. Memphis would gain structure, though the deal must preserve enough shooting and frontcourt mobility.',
    acquiring:['Jarrett Allen','Rim protection and rebounding','Screening and vertical gravity'],
    returnFramework:['Starting-caliber value for Cleveland','Matching salary with positional usefulness','Draft compensation tied to contract control'],
    wins:['Creates a consistent defensive floor behind aggressive guards.','Makes pick-and-roll possessions simpler and more efficient.','Raises the regular-season rebounding baseline.'],
    risks:['Two-big combinations can squeeze spacing.','Playoff opponents may force the center into space.','The acquisition should not consume Memphis’s best perimeter assets.'],
    hurdle:'Cleveland would need a return that improves its playoff flexibility rather than merely replacing Allen’s salary.',
    verdict:'A credible roster fit, but only if Memphis keeps enough shooting and Cleveland receives immediate value.'
  },
  {
    id:'sexton-mia',player:'Collin Sexton',playerId:'4277811',from:'Los Angeles Lakers',fromAbbr:'lal',to:'Miami Heat',toAbbr:'mia',realism:5,fit:6,timeline:'Backcourt spark',cost:'Moderate',
    headline:'Rim pressure and scoring speed for Miami.',
    summary:'Sexton would add downhill force and instant offense to lineups that can become overly deliberate. Miami would have to build the defensive context around him and define whether he starts or leads the second unit.',
    acquiring:['Collin Sexton','North-south rim pressure','Bench and late-clock scoring'],
    returnFramework:['Comparable rotation salary','A lower-cost shooter or defender','Second-round or protected draft value depending on market'],
    wins:['Changes pace immediately when the offense stalls.','Creates paint touches without a complex system.','Can carry scoring possessions with bench units.'],
    risks:['Small backcourts can become a postseason target.','High-energy scoring must translate into consistent team creation.','Miami should avoid paying a first-round premium for role overlap.'],
    hurdle:'The deal only makes sense if Miami can keep enough point-of-attack defense beside him and avoid overpaying for scoring volume.',
    verdict:'Useful offensive fit at a moderate price; less attractive if the return requires premium draft capital.'
  }
];

const tradeLogo=abbr=>`https://a.espncdn.com/i/teamlogos/nba/500/${abbr}.png`;
const tradeHeadshot=id=>`https://a.espncdn.com/i/headshots/nba/players/full/${id}.png`;
const tradeList=document.getElementById('tradeScenarioList'),tradeDetail=document.getElementById('tradeDetail');
const officialTrades=tradeScenarios.filter(item=>item.kind==='official');
const potentialTrades=tradeScenarios.filter(item=>item.kind!=='official');

function meter(value,label){return `<div class="trade-meter"><span>${label}</span><div><i style="width:${value*10}%"></i></div><b>${value}/10</b></div>`}
function bullets(items){return `<ul>${items.map(item=>`<li>${item}</li>`).join('')}</ul>`}
function renderTradeDetail(id,updateUrl=true){
  const trade=officialTrades.find(item=>item.id===id)||officialTrades[0];
  const official=trade.kind==='official';
  document.querySelectorAll('.trade-scenario').forEach(button=>button.classList.toggle('active',button.dataset.trade===trade.id));
  tradeDetail.innerHTML=`
    <div class="trade-detail-top">
      <div class="trade-player-lockup"><img src="${tradeHeadshot(trade.playerId)}" alt="${trade.player}" onerror="this.hidden=true"><div><span class="${official?'official-chip':'hypothetical-chip'}">${official?trade.status:'HYPOTHETICAL'}</span><h3>${trade.player} ${official?'→':'to'} ${trade.to.replace('Philadelphia 76ers','Philadelphia')}</h3><p>${trade.headline}</p></div></div>
      <a class="player-profile-link" href="player.html?player=${encodeURIComponent(trade.player)}&id=${trade.playerId}">PLAYER PROFILE →</a>
    </div>
    <div class="trade-route" aria-label="${trade.from} to ${trade.to}">
      <a href="team.html?team=${encodeURIComponent(trade.from)}"><img src="${tradeLogo(trade.fromAbbr)}" alt="${trade.from} logo"><span>FROM</span><b>${trade.from}</b></a>
      <div><span>${official?trade.moveLabel:'PROPOSED MOVE'}</span><strong>→</strong></div>
      <a href="team.html?team=${encodeURIComponent(trade.to)}"><img src="${tradeLogo(trade.toAbbr)}" alt="${trade.to} logo"><span>TO</span><b>${trade.to}</b></a>
    </div>
    <p class="trade-summary">${trade.summary}</p>
    <div class="trade-metrics">${meter(trade.fit,'BASKETBALL FIT')}${official?`<div class="trade-fact official-fact"><span>TRANSACTION STATUS</span><b>${trade.status}</b></div>`:meter(trade.realism,'TRADE REALISM')}<div class="trade-fact"><span>${official?'COMPLETED':'WINDOW'}</span><b>${official?trade.completed:trade.timeline}</b></div><div class="trade-fact"><span>${official?'TRANSACTION COST':'EXPECTED COST'}</span><b>${trade.cost}</b></div></div>
    <div class="trade-package-grid">
      <section><p class="eyebrow">${trade.toAbbr.toUpperCase()} RECEIVES</p>${bullets(trade.acquiring)}</section>
      <section><p class="eyebrow">${official?(trade.moveLabel==='FREE-AGENT SIGNING'?'TRADE RETURN':trade.fromAbbr.toUpperCase()+' RECEIVES'):'ILLUSTRATIVE RETURN FRAMEWORK'}</p>${bullets(trade.returnFramework)}</section>
    </div>
    <div class="trade-analysis-grid"><section><h4>Why it could work</h4>${bullets(trade.wins)}</section><section><h4>What could break it</h4>${bullets(trade.risks)}</section></div>
    <div class="trade-hurdle"><span>${official?'WHAT COMES NEXT':'BIGGEST HURDLE'}</span><p>${trade.hurdle}</p></div>
    <div class="trade-verdict"><span>BAGWORK VERDICT</span><b>${trade.verdict}</b></div>
    ${official?`<div class="trade-sources"><span>OFFICIAL SOURCES · VERIFIED ${trade.verified.toUpperCase()}</span>${trade.sources.map(source=>`<a href="${source[1]}" target="_blank" rel="noreferrer">${source[0]} ↗</a>`).join('')}</div><p class="trade-legal">Completed transaction details are taken from official team and NBA announcements.</p>`:`<p class="trade-legal">Hypothetical scenario only. It is not a report or confirmed transaction. Exact salary matching, contract clauses, draft-pick availability, tax-apron restrictions, and league approval must be verified if a deal is proposed.</p>`}`;
  if(updateUrl){const url=new URL(location.href);url.searchParams.set('trade',trade.id);history.replaceState(null,'',url)}
}

if(tradeList&&tradeDetail){
  tradeList.innerHTML=officialTrades.map((trade,index)=>`<button class="trade-scenario ${index===0?'active':''}" data-trade="${trade.id}"><img src="${tradeHeadshot(trade.playerId)}" alt=""><span><small>${trade.fromAbbr.toUpperCase()} → ${trade.toAbbr.toUpperCase()}</small><b>${trade.player}</b><em>${trade.status} · ${trade.completed}</em></span><i>→</i></button>`).join('');
  tradeList.querySelectorAll('.trade-scenario').forEach(button=>button.addEventListener('click',()=>renderTradeDetail(button.dataset.trade)));
  renderTradeDetail(new URLSearchParams(location.search).get('trade'),false);
}

const potentialFitGrid=document.getElementById('potentialFitGrid');
if(potentialFitGrid){
  potentialFitGrid.innerHTML=potentialTrades.map(trade=>`<article class="potential-fit-card">
    <div class="potential-player"><img src="${tradeHeadshot(trade.playerId)}" alt="${trade.player}" onerror="this.hidden=true"><div><span class="hypothetical-chip">HYPOTHETICAL</span><h3>${trade.player}</h3><p>${trade.headline}</p></div></div>
    <div class="potential-route"><span><img src="${tradeLogo(trade.fromAbbr)}" alt="">${trade.fromAbbr.toUpperCase()}</span><b>→</b><span><img src="${tradeLogo(trade.toAbbr)}" alt="">${trade.toAbbr.toUpperCase()}</span></div>
    <p class="potential-summary">${trade.summary}</p>
    <div class="potential-scores">${meter(trade.fit,'BASKETBALL FIT')}${meter(trade.realism,'TRADE REALISM')}</div>
    <details><summary>OPEN FIT ANALYSIS <span>＋</span></summary><div class="potential-detail"><section><h4>Why it could work</h4>${bullets(trade.wins)}</section><section><h4>Risks</h4>${bullets(trade.risks)}</section><section><h4>Illustrative return framework</h4>${bullets(trade.returnFramework)}</section><div class="trade-hurdle"><span>BIGGEST HURDLE</span><p>${trade.hurdle}</p></div><div class="trade-verdict"><span>BAGWORK VERDICT</span><b>${trade.verdict}</b></div><p class="trade-legal">Conceptual fit only. This is not a report, completed transaction or claim that the teams are negotiating.</p></div></details>
  </article>`).join('');
}
