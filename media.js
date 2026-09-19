const feed=document.getElementById('newsFeed');
const statusEl=document.getElementById('newsStatus');

function updated(value=new Date()){
  return new Intl.DateTimeFormat([], {dateStyle:'medium',timeStyle:'short'}).format(new Date(value));
}

function fallback(){
  feed.innerHTML='<div class="news-card"><div></div><div><span class="news-meta">NEWS FEED UNAVAILABLE</span><h3>Open a trusted source for the latest NBA reporting.</h3><p>The dashboard could not retrieve the feed right now. The direct source links remain available.</p></div></div>';
  statusEl.textContent=`Feed unavailable · checked ${updated()}`;
}

function renderNews(articles,meta){
  if(!articles.length)throw new Error('empty news feed');
  feed.innerHTML=articles.map(article=>`<a class="news-card" href="${article.links?.web?.href||article.link||'#'}" target="_blank" rel="noreferrer"><img src="${article.images?.[0]?.url||''}" alt="" onerror="this.style.visibility='hidden'"><div><span class="news-meta">${article.source||'ESPN'} · ${article.published?updated(article.published):''}</span><h3>${article.headline}</h3><p>${article.description||'Open story'}</p></div></a>`).join('');
  statusEl.textContent=meta?.updatedAt
    ? `ESPN cache updated ${updated(meta.updatedAt)} · auto-refreshes every ${meta.refreshCadenceMinutes||120} minutes`
    : `Live ESPN feed updated ${updated()}`;
}

async function loadNews(){
  statusEl.textContent='Refreshing credible NBA headlines…';
  feed.innerHTML='<div class="news-loading">Loading latest NBA stories…</div>';
  try{
    const cacheResponse=await fetch(`live.json?v=${Date.now()}`,{cache:'no-store'});
    if(!cacheResponse.ok)throw new Error('cache unavailable');
    const cache=await cacheResponse.json();
    renderNews(cache.news||[],cache.meta);
    return;
  }catch{}
  try{
    const response=await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news?limit=36',{cache:'no-store'});
    if(!response.ok)throw new Error('news unavailable');
    const data=await response.json();
    renderNews(data.articles||[],null);
  }catch{fallback()}
}

document.getElementById('refreshNews').onclick=loadNews;
loadNews();
setInterval(loadNews,900000);
document.title=document.title.replace(/Courtside IQ/g,'BagWork');
document.querySelectorAll('.brand').forEach(brand=>brand.innerHTML='<span class="brand-mark">B</span><span>BAG<br><b>WORK</b></span>');
