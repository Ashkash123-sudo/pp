// player.js - collectible-style athlete card with a pack-opening reveal.
// Reads ?sport=&gender=&level=&id= and shows the player's photo, OVERALL,
// and sport-relevant season stats.
document.addEventListener('DOMContentLoaded', () => {
  const q = new URLSearchParams(location.search);
  const sport = q.get('sport') || '';
  const gender = q.get('gender') || 'Boys';
  const level = q.get('level') || 'Varsity';
  const id = q.get('id') || '';

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const initials = n => String(n || '?').trim().split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase();

  const teamHref = `sport.html?sport=${encodeURIComponent(sport)}&gender=${encodeURIComponent(gender)}&level=${encodeURIComponent(level)}`;
  const back = document.getElementById('backLink');
  if (back) {
    back.setAttribute('href', teamHref + '#roster');
    if (sport) back.textContent = `← ${gender} ${level} ${sport}`;
  }

  let roster = [];
  try { roster = JSON.parse(localStorage.getItem(`cfhs-roster::${level}::${gender}::${sport}`) || '[]'); } catch (e) {}
  const player = roster.find(p => p.id && p.id === id) || (id ? null : roster[0]);

  const main = document.getElementById('playerMain');
  if (!player) {
    main.innerHTML = `<p class="card-note">That player could not be found. <a href="${esc(teamHref)}#roster">Back to the roster</a>.</p>`;
    return;
  }

  document.title = `${player.name} · ${sport} card | Panther Press`;

  const schema = window.cfhsStatSchema ? window.cfhsStatSchema(sport) : [];
  const emoji = (window.CFHS_SPORT_EMOJI || {})[sport] || '🏅';
  const stats = player.stats || {};
  const labelFor = key => { const f = schema.find(x => x[0] === key); return f ? f[1] : key; };

  const keys = schema.map(x => x[0]).filter(key => String(stats[key] == null ? '' : stats[key]).trim() !== '');
  Object.keys(stats).forEach(key => {
    if (keys.indexOf(key) === -1 && String(stats[key]).trim() !== '') keys.push(key);
  });
  const statRows = keys.length
    ? keys.map(key => `<div class="row"><span class="k">${esc(labelFor(key))}</span><span class="v">${esc(stats[key])}</span></div>`).join('')
    : '<p class="empty">No season stats yet — a coach can add them from the team page.</p>';

  const ovrNum = parseInt(player.overall, 10);
  const hasOvr = !isNaN(ovrNum) && ovrNum >= 0 && ovrNum <= 99;

  const bio = [
    `<span>Class <b>${esc(player.className || '—')}</b></span>`,
    player.height && `<span>Ht <b>${esc(player.height)}</b></span>`,
    player.weight && `<span>Wt <b>${esc(player.weight)}</b></span>`,
    `<span>Team <b>${esc(gender)} ${esc(level)}</b></span>`
  ].filter(Boolean).join('');

  main.innerHTML = `
    <div class="tc" id="tc">
      <div class="tc-holo"></div>
      <div class="tc-shine"></div>
      <div class="tc-inner">
        <div class="tc-head">Carolina Forest Panthers <span>${esc(sport.toUpperCase())}</span></div>
        <div class="tc-photo">
          ${player.photo
            ? `<img src="${esc(player.photo)}" alt="${esc(player.name)}">`
            : `<div class="tc-watermark">${esc(initials(player.name))}</div><div class="tc-emoji">${emoji}</div>`}
          ${hasOvr ? `<div class="tc-ovr"><strong id="ovrValue">${ovrNum}</strong><span>OVR</span></div>` : ''}
          ${player.position ? `<div class="tc-pos">${esc(player.position)}</div>` : ''}
          <div class="tc-namebar">
            <h1>${esc(player.name)}</h1>
            <p>#${esc(player.number || '--')} &middot; Carolina Forest &middot; ${esc(gender)} ${esc(level)} ${esc(sport)}</p>
          </div>
        </div>
        <div class="tc-stats">${statRows}</div>
        <div class="tc-foot">Panther Press &middot; 2026&ndash;27 &middot; Go Panthers</div>
      </div>
    </div>
    <div class="tc-bio">${bio}</div>
    <p class="card-note"><a href="${esc(teamHref)}#roster">← Full ${esc(gender)} ${esc(level)} ${esc(sport)} roster</a></p>`;

  const tc = document.getElementById('tc');

  const countUpOvr = () => {
    const el = document.getElementById('ovrValue');
    if (!el || !hasOvr) return;
    const start = performance.now(), dur = 750;
    const step = t => {
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.max(0, Math.round(ovrNum * eased));
      if (k < 1) requestAnimationFrame(step); else el.textContent = ovrNum;
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  };

  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  if (reduce) {
    const el = document.getElementById('ovrValue');
    if (el && hasOvr) el.textContent = ovrNum;
  } else {
    runPackOpen();
  }

  function runPackOpen() {
    main.classList.add('sealed');
    const stage = document.querySelector('.card-stage');

    const backdrop = document.createElement('div');
    backdrop.className = 'backdrop';
    document.body.appendChild(backdrop);

    main.insertAdjacentHTML('afterbegin', `
      <div class="pack" id="pack" role="button" tabindex="0" aria-label="Open card pack">
        <div class="pack-glow"></div>
        <div class="pack-foil pack-l"></div>
        <div class="pack-foil pack-r"></div>
        <div class="pack-strip"></div>
        <div class="tear"></div>
        <div class="pack-face">
          <div class="pack-logo"></div>
          <div class="pack-word">PANTHER PRESS</div>
          <div class="pack-sub">2026&ndash;27 &middot; PANTHER CARD</div>
        </div>
        <div class="pack-hint">Tap to rip open</div>
      </div>`);
    const pack = document.getElementById('pack');

    const spawn = (cls, host, ttl) => {
      const el = document.createElement('div');
      el.className = cls;
      (host || document.body).appendChild(el);
      if (ttl) setTimeout(() => el.remove(), ttl);
      return el;
    };

    const burst = () => {
      spawn('rays go', stage, 1200);
      spawn('flash go', document.body, 650);
      spawn('shockwave go', document.body, 700);
      if (stage) { stage.classList.add('shake'); setTimeout(() => stage.classList.remove('shake'), 520); }

      const fx = spawn('fx', document.body, 1400);
      const bits = ['#e83b4e', '#ffffff', '#f2c14e', '#1a1e22', '#ff8fa0', '#8f0f22'];
      for (let i = 0; i < 30; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        const ang = Math.random() * Math.PI * 2;
        const dist = 130 + Math.random() * 320;
        const shard = i % 5 === 0;
        c.style.setProperty('--dx', `${Math.cos(ang) * dist}px`);
        c.style.setProperty('--dy', `${Math.sin(ang) * dist - 50}px`);
        c.style.setProperty('--dr', `${Math.random() * 900 - 450}deg`);
        c.style.background = shard
          ? 'linear-gradient(140deg,#e6414f,#8f0f22)'
          : bits[i % bits.length];
        if (shard) { c.style.width = '16px'; c.style.height = '22px'; }
        c.style.animationDelay = `${Math.random() * 90}ms`;
        fx.appendChild(c);
      }
    };

    let done = false;
    const openPack = () => {
      if (done) return;
      done = true;
      backdrop.classList.add('dim');
      pack.classList.add('charge');
      setTimeout(() => { pack.classList.remove('charge'); pack.classList.add('rip'); }, 470);
      setTimeout(() => { pack.classList.add('blow'); burst(); }, 730);
      setTimeout(() => {
        main.classList.remove('sealed');
        backdrop.classList.remove('dim');
        tc.classList.add('reveal');
        countUpOvr();
      }, 950);
      setTimeout(() => { pack.remove(); backdrop.remove(); }, 1700);
      setTimeout(() => { tc.classList.remove('reveal'); tc.classList.add('settled'); }, 1900);
    };
    pack.addEventListener('click', openPack);
    pack.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPack(); }
    });
  }

  // Subtle tilt / holo shift (pointer devices only, after reveal).
  if (window.matchMedia('(pointer:fine)').matches) {
    const stage = document.querySelector('.card-stage') || document.body;
    stage.addEventListener('mousemove', e => {
      if (main.classList.contains('sealed')) return;
      const r = tc.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tc.style.transform = `perspective(1100px) rotateX(${(-py * 9).toFixed(2)}deg) rotateY(${(px * 12).toFixed(2)}deg)`;
    });
    stage.addEventListener('mouseleave', () => {
      tc.style.transform = '';
    });
  }
});
