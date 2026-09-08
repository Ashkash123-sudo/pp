// sport.js: dedicated team page. Reads ?sport=&gender=&level= from the URL
// (falls back to a legacy #Sport hash) and fills in the page.
document.addEventListener('DOMContentLoaded', () => {
  // Normalize the legacy logo reference like the rest of the site does.
  document.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src') || '';
    if (src.includes('P (1).png') || src.includes('P%20(1).png') || src.includes('lgo.png')) {
      img.setAttribute('src', 'thumbnail.png');
    }
  });

  const params = new URLSearchParams(location.search);
  let sport = params.get('sport');
  let gender = params.get('gender') || 'Boys';
  let level = params.get('level') || 'Varsity';
  if (!sport && location.hash) sport = decodeURIComponent(location.hash.slice(1));
  if (!sport) sport = 'Football';

  const teamKey = `${level}::${gender}::${sport}`;
  const k = suffix => `cfhs-${suffix}::${teamKey}`;

  // ---- Roles -----------------------------------------------------------
  const auth = window.CFHSAuth || {
    isAdmin: () => false, isCoach: () => false, currentUser: () => null
  };
  const isAdmin = auth.isAdmin();
  const isCoach = auth.isCoach();
  const canManage = isAdmin || isCoach;

  // Hide a whole management section from anyone who is not a coach/admin.
  // Public content (schedule, roster, announcement list) lives outside these.
  function gateSection(selector, allowed) {
    document.querySelectorAll(selector).forEach(el => { el.hidden = !allowed; });
  }
  gateSection('.roster-manager', canManage);      // add player cards
  gateSection('.schedule-manager', canManage);    // submit schedule
  gateSection('.coach-media-card', canManage);    // roster photos
  const annFormEl = document.getElementById('announcementForm');
  if (annFormEl) annFormEl.hidden = !canManage;   // keep the announcement list public
  const annBlurb = document.querySelector('#announcements .announcement-card > div > p:not(.eyebrow)');
  if (annBlurb) {
    annBlurb.textContent = canManage
      ? 'Publish updates for this team below — they post to the team page immediately.'
      : 'Updates published by the team\'s coaches and athletic staff.';
  }

  // ---- Header / hero ---------------------------------------------------------
  document.title = `${gender} ${sport} | Panther Press`;
  setText('sportName', sport);
  setText('levelLabel', `${gender.toUpperCase()} ${level.toUpperCase()}`);
  const subtitle = document.querySelector('.hero-subtitle');
  if (subtitle) subtitle.textContent = `Carolina Forest Panthers · ${gender} ${level} ${sport}`;
  const back = document.querySelector('.back-link');
  if (back) back.setAttribute('href', 'index.html#teams');

  // Records + overview stats, computed from played games in the seeded schedule
  // for THIS exact team (sport + gender + level). No fabricated numbers.
  (function setRecord() {
    const seeded = Array.isArray(window.CFHS_SCHEDULE) ? window.CFHS_SCHEDULE : [];
    const mine = seeded
      .filter(g =>
        (g.sport || '').toLowerCase() === sport.toLowerCase() &&
        (!g.gender || g.gender === gender) &&
        (!g.level || g.level === level))
      .filter(g => /^[WL]\s/.test(g.result || ''))
      .sort((a, b) => new Date(`${a.date}T00:00:00`) - new Date(`${b.date}T00:00:00`));

    const won = g => /^W\s/.test(g.result);
    const rec = list => {
      const w = list.filter(won).length;
      return list.length ? `${w}—${list.length - w}` : '—';
    };

    const el = document.querySelector('.hero-record strong');
    const label = document.querySelector('.hero-record span');
    if (el) el.textContent = mine.length ? rec(mine) : '0—0';
    if (label) label.textContent = mine.length ? 'OVERALL RECORD' : 'SEASON NOT STARTED';

    const stats = document.querySelectorAll('.overview-stats div strong');
    if (stats.length >= 3) {
      stats[0].textContent = rec(mine.filter(g => /region/i.test(g.note || '')));
      stats[1].textContent = rec(mine.filter(g => g.home === true));
      stats[2].textContent = rec(mine.filter(g => g.home === false));
      if (stats[3]) {
        stats[3].textContent = '—';
        const cap = stats[3].nextElementSibling;
        if (cap) cap.textContent = 'Head coach (TBD)';
      }
    }
    const streak = document.querySelector('.streak');
    if (streak) {
      if (!mine.length) { streak.textContent = 'NO GAMES PLAYED'; }
      else {
        const last = won(mine[mine.length - 1]);
        let n = 0;
        for (let i = mine.length - 1; i >= 0 && won(mine[i]) === last; i--) n++;
        streak.textContent = `${last ? 'W' : 'L'}${n} CURRENT STREAK`;
      }
    }
  })();

  // ---- Schedule -------------------------------------------------------------
  function renderSchedule() {
    const wrap = document.getElementById('sportSchedule');
    if (!wrap) return;
    const seeded = Array.isArray(window.CFHS_SCHEDULE) ? window.CFHS_SCHEDULE : [];
    let custom = [];
    try { custom = JSON.parse(localStorage.getItem('cfhs-games') || '[]'); } catch (e) {}
    const games = seeded.concat(Array.isArray(custom) ? custom : [], getCoachGames())
      .filter(g => (g.sport || '').toLowerCase() === sport.toLowerCase())
      .filter(g => !g.gender || g.gender === gender)
      .filter(g => !g.level || g.level === level)
      .sort((a, b) => new Date(`${a.date}T00:00:00`) - new Date(`${b.date}T00:00:00`));
    if (!games.length) {
      wrap.innerHTML = '<p class="muted">No games scheduled yet for this team.</p>';
      return;
    }
    const fmt = iso => {
      const d = new Date(`${iso}T00:00:00`);
      return isNaN(d) ? iso : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };
    wrap.innerHTML = games.map(g => {
      const at = g.home === false ? '@' : 'vs';
      const tail = g.result || g.time || 'TBA';
      const sub = [g.note, g.coach ? 'Coach-submitted' : ''].filter(Boolean).join(' · ');
      return `
        <div class="schedule-line">
          <strong>${esc(fmt(g.date))}</strong>
          <span>${at} ${esc(g.opponent || 'TBD')}${sub ? `<br><small>${esc(sub)}</small>` : ''}</span>
          <small>${esc(tail)}</small>
        </div>`;
    }).join('');
  }

  // ---- Sport-specific stat fields (schema in stats-schema.js) ----------
  const statSchema = window.cfhsStatSchema ||
    (() => [['stat1', 'Stat 1'], ['stat2', 'Stat 2'], ['stat3', 'Stat 3']]);

  function buildStatFields() {
    const box = document.getElementById('statFields');
    if (!box) return;
    box.innerHTML = statSchema(sport)
      .map(([key, lbl]) => `<input name="stat_${key}" placeholder="${lbl}">`).join('');
    const lab = document.getElementById('statFieldsLabel');
    if (lab) lab.textContent = `${sport} season stats (optional)`;
  }
  buildStatFields();

  // ---- Roster -------------------------------------------------------------
  const getRoster = () => JSON.parse(localStorage.getItem(k('roster')) || '[]');
  const setRoster = list => localStorage.setItem(k('roster'), JSON.stringify(list));

  const playerUrl = p =>
    `player.html?sport=${encodeURIComponent(sport)}&gender=${encodeURIComponent(gender)}` +
    `&level=${encodeURIComponent(level)}&id=${encodeURIComponent(p.id || '')}`;

  function renderRoster() {
    const grid = document.getElementById('rosterGrid');
    if (grid) {
      const roster = getRoster();
      grid.innerHTML = roster.length
        ? roster.map((p, i) => `
          <div class="athlete-slot">
            <a class="athlete-card" href="${playerUrl(p)}">
              ${p.photo ? `<img src="${p.photo}" alt="${esc(p.name)}">` : '<span class="athlete-avatar-lg">' + esc(initials(p.name)) + '</span>'}
              <span class="athlete-number">#${esc(p.number || '--')}</span>
              ${/^\d{1,2}$/.test(String(p.overall || '').trim()) ? `<span class="athlete-ovr">${esc(String(p.overall).trim())}<i>OVR</i></span>` : ''}
              <strong>${esc(p.name)}</strong>
              <small>${esc(p.position || '')} · ${esc(p.className || '')}</small>
              <b>VIEW CARD →</b>
            </a>
            ${canManage ? `<button class="athlete-remove" type="button" data-i="${i}" data-name="${esc(p.name)}">Remove</button>` : ''}
          </div>`).join('')
        : '<p class="muted">Roster has not been published yet.</p>';
      grid.querySelectorAll('.athlete-remove').forEach(btn => btn.addEventListener('click', e => {
        e.preventDefault();
        if (!window.confirm(`Remove ${btn.dataset.name} from the ${sport} roster?`)) return;
        const list = getRoster();
        list.splice(+btn.dataset.i, 1);
        setRoster(list);
        renderRoster();
        msg('playerMessage', `${btn.dataset.name} removed from the roster.`);
      }));
    }
    const sel = document.getElementById('athleteSelect');
    if (sel) {
      const roster = getRoster();
      sel.innerHTML = roster.length
        ? roster.map((p, i) => `<option value="${i}">${esc(p.name)}</option>`).join('')
        : '<option value="">No athletes on roster</option>';
    }
  }

  function initials(name) {
    return String(name || '?').trim().split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase();
  }

  // ---- Add player (coach tool) --------------------------------------------
  wire('playerForm', form => {
    const raw = Object.fromEntries(new FormData(form).entries());
    if (!raw.name) return;
    const stats = {};
    Object.keys(raw).forEach(key => {
      if (key.indexOf('stat_') === 0 && String(raw[key]).trim()) {
        stats[key.slice(5)] = String(raw[key]).trim();
      }
    });
    const player = {
      id: 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: raw.name, number: raw.number, position: raw.position,
      className: raw.className, height: raw.height, weight: raw.weight,
      overall: (raw.overall || '').trim(),
      sport, gender, level, stats
    };
    const roster = getRoster();
    roster.push(player);
    setRoster(roster);
    form.reset();
    buildStatFields();
    renderRoster();
    msg('playerMessage', `${player.name} added — open their card to see the profile page.`);
  });

  // ---- Coach schedule submissions --------------------------------------
  const schedKey = k('team-schedule');
  function getCoachGames() {
    try {
      const v = JSON.parse(localStorage.getItem(schedKey) || '[]');
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  const setCoachGames = list => localStorage.setItem(schedKey, JSON.stringify(list));

  function to12h(t) {
    const m = String(t || '').match(/^(\d{1,2}):(\d{2})/);
    if (!m) return t ? String(t) : 'TBA';
    let h = +m[1];
    const ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m[2]} ${ap}`;
  }
  function normHome(v) {
    const s = String(v || '').toLowerCase().trim();
    if (['true', 'home', 'h', 'vs'].includes(s)) return true;
    if (['false', 'away', 'a', '@'].includes(s)) return false;
    return null;
  }
  function makeGame(f) {
    return {
      sport, gender, level,
      date: f.date || '',
      time: to12h(f.time),
      opponent: (f.opponent || 'TBA').trim(),
      home: normHome(f.home),
      result: '',
      note: (f.note || '').trim(),
      coach: true
    };
  }

  function renderCoachGames() {
    const wrap = document.getElementById('coachGameList');
    if (!wrap) return;
    const games = getCoachGames()
      .map((g, i) => ({ g, i }))
      .sort((a, b) => new Date(`${a.g.date}T00:00:00`) - new Date(`${b.g.date}T00:00:00`));
    wrap.innerHTML = games.length
      ? `<p class="eyebrow">YOUR SUBMITTED GAMES (${games.length})</p>` + games.map(({ g, i }) => `
        <div class="coach-game-row">
          <span>${esc(g.date || 'TBD')} · ${g.home === false ? '@' : 'vs'} ${esc(g.opponent)} · ${esc(g.time || 'TBA')}${g.note ? ' · ' + esc(g.note) : ''}</span>
          <button type="button" data-i="${i}">Remove</button>
        </div>`).join('')
      : '<p class="muted">You haven\'t submitted any games yet.</p>';
    wrap.querySelectorAll('button[data-i]').forEach(btn => {
      btn.addEventListener('click', () => {
        const list = getCoachGames();
        list.splice(+btn.dataset.i, 1);
        setCoachGames(list);
        renderCoachGames();
        renderSchedule();
      });
    });
  }

  wire('teamGameForm', form => {
    const f = Object.fromEntries(new FormData(form).entries());
    if (!f.date || !f.opponent) { msg('teamGameMessage', 'Date and opponent are required.'); return; }
    const list = getCoachGames();
    list.push(makeGame(f));
    setCoachGames(list);
    form.reset();
    renderCoachGames();
    renderSchedule();
    msg('teamGameMessage', `Added ${sport} ${f.opponent} on ${f.date}.`);
  });

  wire('teamScheduleBulk', form => {
    const f = Object.fromEntries(new FormData(form).entries());
    const lines = String(f.bulk || '').split('\n').map(s => s.trim()).filter(Boolean);
    if (!lines.length) { msg('teamGameMessage', 'Paste at least one game line first.'); return; }
    const parsed = [];
    const skipped = [];
    lines.forEach((line, n) => {
      const p = line.split('|').map(s => s.trim());
      if (p.length < 3 || !/^\d{4}-\d{2}-\d{2}$/.test(p[0])) { skipped.push(n + 1); return; }
      parsed.push(makeGame({ date: p[0], time: p[1], opponent: p[2], home: p[3], note: p[4] }));
    });
    if (!parsed.length) {
      msg('teamGameMessage', "Couldn't read any lines. Format: DATE | TIME | OPPONENT | home/away | note");
      return;
    }
    setCoachGames(f.replace ? parsed : getCoachGames().concat(parsed));
    form.reset();
    renderCoachGames();
    renderSchedule();
    msg('teamGameMessage',
      `Saved ${parsed.length} game${parsed.length === 1 ? '' : 's'}${f.replace ? ' (replaced previous)' : ''}.` +
      (skipped.length ? ` Skipped line${skipped.length === 1 ? '' : 's'} ${skipped.join(', ')}.` : ''));
  });

  // ---- Player photo ------------------------------------------------------
  wire('photoForm', form => {
    const idx = (document.getElementById('athleteSelect') || {}).value;
    const file = (document.getElementById('photoInput') || {}).files?.[0];
    if (idx === '' || idx == null || !file) {
      msg('photoMessage', 'Select an athlete and an image first.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const roster = getRoster();
      if (roster[idx]) {
        roster[idx].photo = reader.result;
        setRoster(roster);
        renderRoster();
      }
      form.reset();
      msg('photoMessage', 'Player photo saved.');
    };
    reader.readAsDataURL(file);
  });

  // ---- Announcements ----------------------------------------------------
  function renderAnnouncements() {
    const list = document.getElementById('announcementList');
    if (!list) return;
    let items = [];
    try { items = JSON.parse(localStorage.getItem(k('ann')) || '[]'); } catch (e) {}
    list.innerHTML = items.map(a =>
      `<div><strong>${esc(a.text)}</strong><small>${esc(a.when)}</small></div>`).join('');
    // If a visitor can't post and there's nothing to read, hide the card —
    // and the whole section if the coach-media card is hidden too.
    const empty = !canManage && items.length === 0;
    const card = document.querySelector('#announcements .announcement-card');
    if (card) card.hidden = empty;
    const section = document.querySelector('.announcement-section');
    if (section) section.hidden = empty;
  }
  wire('announcementForm', form => {
    const text = new FormData(form).get('announcement');
    if (!text) return;
    const items = JSON.parse(localStorage.getItem(k('ann')) || '[]');
    items.unshift({ text, when: new Date().toLocaleString() });
    localStorage.setItem(k('ann'), JSON.stringify(items));
    form.reset();
    renderAnnouncements();
  });

  // ---- Coach portal notice (codes are issued from the Admin Dashboard) --
  (function setupCoachAccess() {
    const heading = document.getElementById('coachHeading');
    const desc = document.getElementById('coachDescription');
    const note = document.getElementById('coachAdminNote');
    if (canManage && !isAdmin) {
      if (heading) heading.textContent = 'You can manage Panther teams';
      if (desc) desc.textContent = 'You are signed in as a coach. This team\'s roster, schedule, player photo, and announcement tools are unlocked above.';
    }
    if (isAdmin && note) note.hidden = false;
  })();

  // ---- Live game center ------------------------------------------------
  let home = 0, away = 0;
  document.querySelectorAll('.score-controls button').forEach(btn => {
    btn.addEventListener('click', () => {
      const pts = parseInt(btn.dataset.points, 10) || 0;
      if (btn.dataset.score === 'home') home += pts; else away += pts;
      setText('homeScore', home);
      setText('awayScore', away);
      const feed = document.getElementById('playFeed');
      if (feed) {
        const p = document.createElement('p');
        p.innerHTML = `<time>${new Date().toLocaleTimeString()}</time> ` +
          `${btn.dataset.score === 'home' ? 'Carolina Forest' : 'Opponent'} +${pts}`;
        feed.prepend(p);
      }
    });
  });

  // ---- Sport tabs: smooth in-page scroll ------------------------------
  document.querySelectorAll('.sport-tabs a').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  renderSchedule();
  renderRoster();
  renderAnnouncements();
  renderCoachGames();

  // ---- helpers -------------------------------------------------------
  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  function msg(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
  function wire(id, handler) {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      handler(form);
    });
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
});
