const leagueCalendarMonths = [
  {year:2026, month:8, label:'September 2026'},
  {year:2026, month:9, label:'October 2026'},
  {year:2026, month:10, label:'November 2026'},
  {year:2026, month:11, label:'December 2026'},
  {year:2027, month:0, label:'January 2027'},
  {year:2027, month:1, label:'February 2027'},
  {year:2027, month:2, label:'March 2027'},
  {year:2027, month:3, label:'April 2027'},
  {year:2027, month:4, label:'May 2027'},
  {year:2027, month:5, label:'June 2027'},
  {year:2027, month:6, label:'July 2027'}
];

const leagueCalendarEvents = [
  ['2026-09-21','deadline','International-game players may report','First allowable reporting date.'],
  ['2026-09-22','league','International preseason camps open','Training camps open for teams playing outside North America.'],
  ['2026-09-28','deadline','Veterans may report','Reporting opens for all other veteran players.'],
  ['2026-09-29','league','NBA training camps open','All remaining teams officially begin camp.'],
  ['2026-10-03','league','Preseason begins','NBA preseason games tip off.'],
  ['2026-10-09','showcase','NBA China Games','Dallas vs. Houston in Macao.'],
  ['2026-10-10','showcase','NBA Canada Games','Toronto vs. LA Clippers in Vancouver.'],
  ['2026-10-11','showcase','NBA China Games','Dallas vs. Houston rematch in Macao.'],
  ['2026-10-19','deadline','Opening-day rosters set','Final rosters due at 5 p.m. ET.'],
  ['2026-10-20','league','Opening Night','Celtics–Pistons, 76ers–Knicks and Thunder–Spurs.'],
  ['2026-10-30','cup','NBA Cup group play begins','First of the 2026 Cup Nights.'],
  ['2026-11-07','showcase','Mexico City Game','Denver vs. Indiana at Arena CDMX.'],
  ['2026-11-24','cup','NBA Cup Night','Special Tuesday group-play slate.'],
  ['2026-11-25','cup','NBA Cup Night','Thanksgiving Eve group-play tripleheader.'],
  ['2026-11-27','cup','NBA Cup group finale','Final group-play games and knockout qualification.'],
  ['2026-12-04','cup','NBA Cup quarterfinals','Knockout round begins.'],
  ['2026-12-05','cup','NBA Cup quarterfinals','Second quarterfinal date.'],
  ['2026-12-08','cup','NBA Cup semifinals window','Single-elimination semifinals begin.'],
  ['2026-12-09','cup','NBA Cup semifinals window','Second possible semifinal date.'],
  ['2026-12-11','cup','NBA Cup Championship','Final at Hinkle Fieldhouse in Indianapolis.'],
  ['2026-12-19','showcase','G League Winter Showcase','Four-day scouting showcase begins in Orlando.'],
  ['2026-12-19','league','G League regular season begins','The 36-game regular season tips off.'],
  ['2026-12-25','showcase','Christmas Day','Five-game national showcase.'],
  ['2027-01-05','deadline','10-day contracts open','Teams may begin signing 10-day deals.'],
  ['2027-01-10','deadline','Contracts become guaranteed','Non-guaranteed contracts lock for the season.'],
  ['2027-01-14','showcase','NBA Paris Game','San Antonio vs. New Orleans at Accor Arena.'],
  ['2027-01-17','showcase','NBA Manchester Game','San Antonio vs. New Orleans at Co-op Live.'],
  ['2027-01-18','showcase','NBA on MLK Day','Four-game national slate.'],
  ['2027-01-26','showcase','NBA Rivals Week begins','Five-day rivalry showcase starts.'],
  ['2027-01-30','showcase','NBA Rivals Week ends','Final day of the rivalry slate.'],
  ['2027-02-03','showcase','NBA Pioneers Classic','Knicks at Pistons on ESPN.'],
  ['2027-02-11','deadline','NBA trade deadline','Final in-season trading day.'],
  ['2027-02-15','showcase','Presidents’ Day slate','Four-game national showcase.'],
  ['2027-02-19','showcase','All-Star Weekend begins','Phoenix hosts the 2027 festivities.'],
  ['2027-02-21','showcase','NBA All-Star Game','All-Star Weekend finale.'],
  ['2027-02-24','league','All-Star break ends','Regular-season schedule resumes.'],
  ['2027-03-27','league','G League regular season ends','The developmental league closes its regular season.'],
  ['2027-03-30','league','G League playoffs begin','Postseason play starts.'],
  ['2027-04-11','league','NBA regular-season finale','All 30 teams play.'],
  ['2027-04-12','deadline','Playoff rosters set','Postseason rosters due at 3 p.m. ET.'],
  ['2027-04-13','league','Play-In Tournament begins','Four-day Play-In window opens.'],
  ['2027-04-16','league','Play-In Tournament ends','Final playoff berths are decided.']
];

const leagueCalendarTba = {
  '2027-04': ['NBA Playoffs begin after the Play-In Tournament — exact date has not yet been announced.'],
  '2027-05': ['Conference Semifinals and Conference Finals — dates to be announced.','2027 NBA Draft Lottery and Draft Combine — dates to be announced.'],
  '2027-06': ['2027 NBA Finals — complete series dates to be announced.','2027 NBA Draft — dates to be announced.','Free-agency negotiation period — official opening date to be announced.'],
  '2027-07': ['Free-agent signing period and moratorium dates — to be announced.','2027 NBA Summer League dates — to be announced.']
};

const calendarRoot = document.getElementById('monthCalendar');

if (calendarRoot) {
  const monthSelect = document.getElementById('calendarMonth');
  const previousButton = document.getElementById('calendarPrev');
  const nextButton = document.getElementById('calendarNext');
  const today = new Date();
  let monthIndex = leagueCalendarMonths.findIndex(item => item.year === today.getFullYear() && item.month === today.getMonth());
  if (monthIndex < 0) monthIndex = 1;

  leagueCalendarMonths.forEach((item, index) => monthSelect.add(new Option(item.label, String(index))));

  function calendarDateKey(year, month, day) {
    return `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  }

  function renderLeagueCalendar() {
    const current = leagueCalendarMonths[monthIndex];
    const firstWeekday = new Date(current.year, current.month, 1).getDay();
    const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
    const cells = [];
    for (let blank = 0; blank < firstWeekday; blank += 1) cells.push('<div class="calendar-day calendar-day-empty" aria-hidden="true"></div>');
    for (let day = 1; day <= daysInMonth; day += 1) {
      const key = calendarDateKey(current.year, current.month, day);
      const dayEvents = leagueCalendarEvents.filter(event => event[0] === key);
      const isToday = key === calendarDateKey(today.getFullYear(), today.getMonth(), today.getDate());
      cells.push(`<article class="calendar-day ${dayEvents.length ? 'has-events' : ''} ${isToday ? 'is-today' : ''}"><span class="calendar-number">${day}</span>${dayEvents.map(event => `<button class="calendar-event ${event[1]}" title="${event[3]}" type="button"><b>${event[2]}</b><small>${event[3]}</small></button>`).join('')}</article>`);
    }
    const monthKey=`${current.year}-${String(current.month + 1).padStart(2,'0')}`;
    const scheduledCount=leagueCalendarEvents.filter(event => event[0].startsWith(monthKey)).length;
    const tbaItems=leagueCalendarTba[monthKey]||[];
    calendarRoot.innerHTML = `<div class="month-calendar-title"><div><span>OFFICIAL NBA CALENDAR</span><h3>${current.label}</h3></div><p>${scheduledCount} confirmed event${scheduledCount===1?'':'s'}</p></div><div class="calendar-weekdays">${['SUN','MON','TUE','WED','THU','FRI','SAT'].map(day => `<span>${day}</span>`).join('')}</div><div class="calendar-grid">${cells.join('')}</div>${tbaItems.length?`<div class="calendar-tba"><span>DATES PENDING</span>${tbaItems.map(item=>`<p>${item}</p>`).join('')}</div>`:''}`;
    monthSelect.value = String(monthIndex);
    previousButton.disabled = monthIndex === 0;
    nextButton.disabled = monthIndex === leagueCalendarMonths.length - 1;
  }

  previousButton.onclick = () => { if (monthIndex > 0) { monthIndex -= 1; renderLeagueCalendar(); } };
  nextButton.onclick = () => { if (monthIndex < leagueCalendarMonths.length - 1) { monthIndex += 1; renderLeagueCalendar(); } };
  monthSelect.onchange = () => { monthIndex = Number(monthSelect.value); renderLeagueCalendar(); };
  renderLeagueCalendar();
}
