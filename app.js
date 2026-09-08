// app.js: runtime UI fixes
document.addEventListener('DOMContentLoaded', () => {
  // Replace legacy PNG logo references with the supplied SVG
  document.querySelectorAll('img').forEach(img => {
    const srcAttr = img.getAttribute('src');
    if (!srcAttr) return;
    // Normalize known legacy logo filenames to the repository's `Logo.png`
    if (srcAttr.includes('P (1).png') || srcAttr.includes('P%20(1).png') || srcAttr.includes('panther-press-logo.svg') || srcAttr.includes('lgo.png')) {
      img.setAttribute('src', 'thumbnail.png');
    }
  });

  // Show ADMIN nav only for authenticated administrators (role must be 'Admin')
  const adminNav = document.getElementById('adminNav');
  const userSession = JSON.parse(localStorage.getItem('cfhs-user-session') || 'null');
  if (adminNav) {
    if (userSession && (userSession.role === 'Admin' || userSession.role === 'Athletic Admin')) {
      adminNav.hidden = false;
    } else {
      adminNav.hidden = true;
    }
  }

  // Protect admin section in-page: hide admin content unless admin
  const adminSection = document.getElementById('admin');
  if (adminSection) {
    if (!(userSession && (userSession.role === 'Admin' || userSession.role === 'Athletic Admin'))) {
      adminSection.style.display = 'none';
    }
  }

  // --- Schedule + scores (Carolina Forest 2026-27 data from schedule-data.js,
  //     plus any games staff add locally via the admin "Create a game" form)
  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

  function allGames() {
    const seeded = Array.isArray(window.CFHS_SCHEDULE) ? window.CFHS_SCHEDULE : [];
    let custom = [];
    try { custom = JSON.parse(localStorage.getItem('cfhs-games') || '[]'); } catch (e) {}
    const coach = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.indexOf('cfhs-team-schedule::') === 0) {
          const arr = JSON.parse(localStorage.getItem(key) || '[]');
          if (Array.isArray(arr)) coach.push.apply(coach, arr);
        }
      }
    } catch (e) {}
    return seeded.concat(Array.isArray(custom) ? custom : [], coach);
  }
  function gameDate(g) {
    // Accept 'YYYY-MM-DD' plus a display time; fall back to Date parsing.
    const d = new Date(`${g.date || ''}T00:00:00`);
    return isNaN(d) ? new Date(`${g.date || ''} ${g.time || ''}`) : d;
  }
  function fmtDate(g) {
    const d = gameDate(g);
    if (isNaN(d)) return (g.date || '').toUpperCase();
    return `${DAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${d.getDate()}`;
  }
  function matchup(g) {
    const vs = g.home === false ? '@' : g.home === true ? 'vs' : 'vs';
    return `${vs} ${g.opponent || 'TBA'}`;
  }
  function teamLabel(g) {
    const g2 = g.gender ? `${g.gender} ` : '';
    return `${g.level || 'Varsity'} ${g2}${g.sport || ''}`.trim();
  }

  function renderSchedule(filter = 'all') {
    const list = document.getElementById('scheduleList');
    if (!list) return;
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const upcoming = allGames()
      .filter(g => !g.result)
      .filter(g => { const d = gameDate(g); return isNaN(d) || d >= now; })
      .filter(g => filter === 'all' ? true : (g.sport === filter))
      .sort((a, b) => gameDate(a) - gameDate(b))
      .slice(0, 14);

    if (!upcoming.length) {
      list.innerHTML = '<p class="muted">No upcoming games for this filter.</p>';
      return;
    }
    list.innerHTML = upcoming.map(g => {
      const d = gameDate(g);
      const yr = isNaN(d) ? '' : d.getFullYear();
      const place = g.home === false ? 'Away' : g.home === true ? 'Home' : (g.note || 'Neutral');
      return `
        <div class="game-row">
          <div class="game-date">${fmtDate(g)}<small>${yr}</small></div>
          <div class="game-title">${teamLabel(g)}<small>${matchup(g)} · ${place}</small></div>
          <div class="game-time">${g.time || 'TBA'}<small>${g.note && place !== g.note ? g.note : g.sport}</small></div>
          <div class="game-status">UP NEXT</div>
        </div>`;
    }).join('');
  }

  function renderScores() {
    const grid = document.getElementById('scoreGrid');
    if (!grid) return;
    const played = allGames()
      .filter(g => g.result && /^[WL]\s/.test(g.result))
      .sort((a, b) => gameDate(b) - gameDate(a))
      .slice(0, 6);
    if (!played.length) { grid.innerHTML = '<p class="muted">No results posted yet.</p>'; return; }
    grid.innerHTML = played.map(g => {
      const m = g.result.match(/^([WL])\s+(\d+)\s*-\s*(\d+)/);
      const won = m && m[1] === 'W';
      const cf = m ? m[2] : '', opp = m ? m[3] : '';
      return `
        <div class="score-card">
          <div class="score-meta"><span>${(g.level && g.level !== 'Varsity' ? g.level + ' ' : '') + (g.gender ? g.gender + ' ' : '') + g.sport}</span><span>FINAL · ${fmtDate(g)}</span></div>
          <div class="score-teams">
            <div class="score-team"><span>Carolina Forest</span><strong>${cf}</strong></div>
            <div class="score-team"><span>${g.opponent}</span><strong>${opp}</strong></div>
          </div>
          <div class="score-foot">${g.home === false ? 'Away' : g.home === true ? 'Home' : 'Neutral'} · ${won ? 'Win' : 'Loss'}</div>
        </div>`;
    }).join('');
  }

  // Official ticketing (Horry County / Hometown Ticketing box office).
  const BOX_OFFICE = 'https://events.hometownticketing.com/boxoffice/horry/entity/schools/1';

  function renderTickets() {
    const list = document.getElementById('ticketList');
    const tabs = document.getElementById('ticketTabs');
    if (!list) return;

    const now = new Date(); now.setHours(0, 0, 0, 0);
    const horizon = new Date(now); horizon.setDate(horizon.getDate() + 60); // "in season" window
    const upcoming = allGames()
      .filter(g => !g.result)
      .filter(g => { const d = gameDate(g); return isNaN(d) || d >= now; })
      .sort((a, b) => gameDate(a) - gameDate(b));

    if (!upcoming.length) {
      if (tabs) tabs.innerHTML = '';
      list.innerHTML = `<div class="ticket-row"><div><h3>No games on sale yet</h3>` +
        `<p>Check the official box office for the latest Panthers events.</p></div>` +
        `<a class="button button-primary" href="${BOX_OFFICE}" target="_blank" rel="noopener">Box office <span>↗</span></a></div>`;
      return;
    }

    // Nearest upcoming game per sport → which sports get a button, soonest first.
    // As a season ends its games drop off and the button disappears; the next
    // sport in season appears on its own.
    const firstBySport = {};
    upcoming.forEach(g => { const s = g.sport || 'Other'; if (!firstBySport[s]) firstBySport[s] = g; });
    let sports = Object.keys(firstBySport).sort((a, b) => gameDate(firstBySport[a]) - gameDate(firstBySport[b]));
    const inSeason = sports.filter(s => { const d = gameDate(firstBySport[s]); return isNaN(d) || d <= horizon; });
    sports = inSeason.length ? inSeason : sports.slice(0, 1);

    let active = list.dataset.sport;
    if (!active || sports.indexOf(active) === -1) active = sports[0];
    list.dataset.sport = active;

    if (tabs) {
      tabs.innerHTML = sports.map(s =>
        `<button class="filter${s === active ? ' active' : ''}" data-sport="${s}">${s}</button>`).join('');
      tabs.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => {
        list.dataset.sport = btn.getAttribute('data-sport');
        renderTickets();
      }));
    }

    // Top 3 upcoming for the active sport — home games first.
    const forSport = upcoming.filter(g => (g.sport || 'Other') === active);
    const picks = forSport.filter(g => g.home === true)
      .concat(forSport.filter(g => g.home !== true)).slice(0, 3);

    list.innerHTML = picks.map(g => {
      const d = gameDate(g);
      const when = `${fmtDate(g)}${isNaN(d) ? '' : ' · ' + d.getFullYear()} · ${g.time || 'TBA'}`;
      const site = g.home === true ? 'Home · Carolina Forest HS' : g.home === false ? 'Away · ' + g.opponent : (g.note || 'Neutral site');
      return `
        <div class="ticket-row">
          <div>
            <p class="eyebrow">${when}</p>
            <h3>${teamLabel(g)}</h3>
            <p>${matchup(g)} · ${site}</p>
          </div>
          <a class="button button-primary" href="${g.ticketUrl || BOX_OFFICE}" target="_blank" rel="noopener">Buy tickets <span>↗</span></a>
        </div>`;
    }).join('');
  }

  // wire up filter buttons
  document.querySelectorAll('.filter-pills .filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pills .filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSchedule(btn.getAttribute('data-filter') || 'all');
    });
  });

  // initial render
  renderSchedule('all');
  renderScores();
  renderTickets();

  // --- Hero slideshow: rotating Panthers-season sports photos with a crossfade
  (function setupHeroSlideshow(){
    const seasonImage = document.getElementById('seasonImage');
    const seasonLabel = document.getElementById('seasonLabel');
    if (!seasonImage) return;
    const u = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;
    const slides = [
      { src: u('photo-1566577739112-5180d4bf9390'), label: 'FOOTBALL',       season: 'FALL',   alt: 'Football on the field under the lights' },
      { src: u('photo-1547347298-4074fc3086f0'),    label: 'VOLLEYBALL',     season: 'FALL',   alt: 'Volleyball team celebrating a point' },
      { src: u('photo-1607962837359-5e7e89f86776'),  label: 'CROSS COUNTRY', season: 'FALL',   alt: 'Runners training outdoors in the fall' },
      { src: u('photo-1519766304817-4f37bda74a26'),  label: 'BASKETBALL',    season: 'WINTER', alt: 'High school basketball game in the gym' },
      { src: u('photo-1546519638-68e109498ffc'),     label: 'BASKETBALL',    season: 'WINTER', alt: 'Basketball dropping through the net' },
      { src: u('photo-1461896836934-ffe607ba8211'),  label: 'TRACK & FIELD', season: 'SPRING', alt: 'Sprinter in the blocks on the track' },
      { src: u('photo-1594470117722-de4b9a02ebed'),  label: 'SOCCER',        season: 'SPRING', alt: 'Soccer players battling for the ball' }
    ];
    // Preload so the crossfade never flashes an empty frame.
    slides.forEach(s => { const img = new Image(); img.src = s.src; });

    seasonImage.style.transition = 'opacity .55s ease';
    let idx = 0;
    const apply = i => {
      seasonImage.src = slides[i].src;
      seasonImage.alt = slides[i].alt;
      if (seasonLabel) seasonLabel.textContent = `${slides[i].label} · ${slides[i].season}`;
    };
    apply(0);

    setInterval(() => {
      const next = (idx + 1) % slides.length;
      const pre = new Image();
      pre.onload = pre.onerror = () => {
        seasonImage.style.opacity = '0';
        setTimeout(() => {
          idx = next;
          apply(idx);
          seasonImage.style.opacity = '1';
        }, 350);
      };
      pre.src = slides[next].src;
    }, 5000);
  })();



  // --- Teams / sports directory: Boys / Girls columns, each sport links to its own page
  const SPORTS_BY_LEVEL = {
    Varsity: {
      Boys: ['Baseball','Basketball','Cross Country','Football','Golf','Lacrosse','Soccer','Swimming','Tennis','Track & Field','Volleyball','Wrestling'],
      Girls: ['Basketball','Cross Country','Golf','Lacrosse','Soccer','Softball','Swimming','Tennis','Volleyball','Wrestling']
    },
    JV: {
      Boys: ['Baseball','Basketball','Football','Lacrosse','Soccer','Tennis','Volleyball'],
      Girls: ['Basketball','Lacrosse','Soccer','Softball','Volleyball']
    },
    Freshman: {
      Boys: ['Baseball','Football'],
      Girls: ['Volleyball']
    }
  };
  const SPORT_EMOJI = {
    'Baseball':'⚾','Softball':'🥎','Basketball':'🏀','Soccer':'⚽','Football':'🏈',
    'Volleyball':'🏐','Tennis':'🎾','Golf':'⛳','Swimming':'🏊','Cross Country':'🏃',
    'Track & Field':'🎽','Lacrosse':'🥍','Wrestling':'🤼'
  };

  function renderTeams(level = 'Varsity') {
    const grid = document.getElementById('teamGrid');
    if (!grid) return;
    const groups = SPORTS_BY_LEVEL[level] || SPORTS_BY_LEVEL.Varsity;
    grid.innerHTML = '';

    const labels = document.createElement('div');
    labels.className = 'gender-labels';
    labels.innerHTML = '<span>Boys</span><span>Girls</span>';
    grid.appendChild(labels);

    ['Boys', 'Girls'].forEach(gender => {
      const col = document.createElement('div');
      col.className = 'gender-column ' + gender.toLowerCase();
      const list = groups[gender] || [];
      if (!list.length) {
        col.innerHTML = '<p class="muted">No teams at this level.</p>';
      } else {
        list.forEach(name => {
          const tile = document.createElement('div');
          tile.className = 'sport-tile ' + gender.toLowerCase();
          const href = `sport.html?sport=${encodeURIComponent(name)}&gender=${gender}&level=${encodeURIComponent(level)}`;
          tile.innerHTML =
            `<a href="${href}">` +
            `<span class="sport-icon" aria-hidden="true">${SPORT_EMOJI[name] || '🏅'}</span>` +
            `<span class="sport-name">${name}</span><b>→</b></a>`;
          col.appendChild(tile);
        });
      }
      grid.appendChild(col);
    });
  }


  // wire level tabs
  document.querySelectorAll('.level-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.level-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const level = btn.getAttribute('data-level') || 'Varsity';
      renderTeams(level);
      const levelLabel = document.getElementById('levelLabel'); if (levelLabel) levelLabel.textContent = level.toUpperCase();
    });
  });

  // initial teams render (respect existing active tab)
  const activeTab = document.querySelector('.level-tab.active');
  renderTeams(activeTab ? activeTab.getAttribute('data-level') : 'Varsity');

  // --- Admin: generate coach access codes (stored in 'cfhs-coach-codes',
  //     read by coach-auth.js on coach-login.html)
  (function coachCodeAdmin() {
    const form = document.getElementById('coachCodeForm');
    const table = document.getElementById('coachCodeTable');
    if (!form || !table) return;
    const isAdmin = !!(userSession && (userSession.role === 'Admin' || userSession.role === 'Athletic Admin'))
      || !!safeParse(localStorage.getItem('cfhs-admin-session'));
    if (!isAdmin) return;

    const read = () => {
      const v = safeParse(localStorage.getItem('cfhs-coach-codes'));
      return Array.isArray(v) ? v : [];
    };
    const write = list => localStorage.setItem('cfhs-coach-codes', JSON.stringify(list));
    const newCode = () => {
      const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let s = 'CFHS-COACH-';
      for (let i = 0; i < 6; i++) s += abc[Math.floor(Math.random() * abc.length)];
      return s;
    };

    function render() {
      const list = read();
      if (!list.length) { table.innerHTML = '<div class="admin-table-head"><span>Issued codes</span><span>STATUS</span></div><div><span class="muted">None yet</span><b></b></div>'; return; }
      table.innerHTML = '<div class="admin-table-head"><span>Issued codes</span><span>STATUS</span></div>' +
        list.slice().reverse().map(c => {
          const status = c.revoked ? 'REVOKED' : c.claimed ? 'CLAIMED' : 'OPEN';
          const team = [c.level, c.sport].filter(Boolean).join(' · ');
          return `<div>
            <span><strong>${esc(c.name || '—')}</strong>${team ? ' · ' + esc(team) : ''}<br><code>${esc(c.code)}</code>${c.email ? ' · ' + esc(c.email) : ''}</span>
            <b>${c.revoked ? status : `${status} <button type="button" class="revoke-code" data-code="${esc(c.code)}">${c.claimed ? 'Disable' : 'Revoke'}</button>`}</b>
          </div>`;
        }).join('');
      table.querySelectorAll('.revoke-code').forEach(btn => btn.addEventListener('click', () => {
        const list = read();
        const item = list.find(c => c.code === btn.getAttribute('data-code'));
        if (item) { item.revoked = true; item.revokedAt = new Date().toISOString(); }
        write(list); render();
      }));
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(form).entries());
      const name = (d.coachName || '').trim();
      if (!name) return;
      const list = read();
      const code = newCode();
      list.push({
        code, name,
        level: d.coachLevel || 'Varsity',
        sport: (d.coachSport || '').trim(),
        email: (d.coachEmail || '').trim().toLowerCase(),
        claimed: false, revoked: false,
        createdBy: (userSession && userSession.email) || 'admin',
        createdAt: new Date().toISOString()
      });
      write(list);
      form.reset();
      render();
      const msg = document.getElementById('coachCodeMessage');
      if (msg) msg.textContent = `Code for ${name}: ${code} — send it to them for the coach login page.`;
      window.prompt(`Coach code for ${name} — copy and send it to them:`, code);
    });

    render();
  })();

  function safeParse(s) { try { return JSON.parse(s || 'null'); } catch (e) { return null; } }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

});
