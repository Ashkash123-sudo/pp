// coach-auth.js - client-side coach login for the static demo.
// A coach signs in with username + email + password + an authorization code
// that an athletic administrator generated for them (see the sport page,
// admin "Generate a coach code" tool). Codes live in localStorage
// 'cfhs-coach-codes'. Passwords are stored in plain text here, same as the
// rest of this demo - do not reuse this pattern with real credentials.
(function () {
  const form = document.getElementById('coachLoginForm');
  const msgEl = document.getElementById('coachLoginMessage');
  if (!form) return;

  const readCodes = () => {
    try {
      const v = JSON.parse(localStorage.getItem('cfhs-coach-codes') || '[]');
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  };
  const writeCodes = list => localStorage.setItem('cfhs-coach-codes', JSON.stringify(list));
  const readUsers = () => {
    try { return JSON.parse(localStorage.getItem('cfhs-users') || '{}') || {}; }
    catch (e) { return {}; }
  };
  const norm = s => (s || '').trim();
  const say = (text, ok) => {
    msgEl.textContent = text;
    msgEl.classList.toggle('ok', !!ok);
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const username = norm(document.getElementById('clUsername').value);
    const email = norm(document.getElementById('clEmail').value).toLowerCase();
    const password = document.getElementById('clPassword').value || '';
    const code = norm(document.getElementById('clCode').value).toUpperCase();

    if (!username || !email || !password || !code) {
      say('Fill in every field.');
      return;
    }

    const codes = readCodes();
    const entry = codes.find(c => (c.code || '').toUpperCase() === code);
    if (!entry || entry.revoked) {
      say('That authorization code is not valid. Ask an athletic administrator for a new one.');
      return;
    }

    const users = readUsers();

    if (!entry.claimed) {
      // First sign-in: bind this code to the coach's credentials.
      if (entry.email && entry.email.toLowerCase() !== email) {
        say('This code was issued for a different email address.');
        return;
      }
      if (users[email] && users[email].role === 'Admin') {
        say('That email already belongs to an administrator account.');
        return;
      }
      entry.claimed = true;
      entry.claimedAt = new Date().toISOString();
      entry.email = email;
      entry.username = username;
      entry.password = password;
      writeCodes(codes);

      users[email] = {
        email, password, username,
        role: 'Coach',
        name: entry.name || username,
        level: entry.level || 'Varsity'
      };
      localStorage.setItem('cfhs-users', JSON.stringify(users));
      startSession(users[email]);
      say('Welcome. Signing you in...', true);
      setTimeout(() => location.href = 'index.html', 700);
      return;
    }

    // Returning coach: username + email + password + code must all match.
    if (entry.email.toLowerCase() !== email || entry.username !== username || entry.password !== password) {
      say('Username, email, password, and code do not match our records.');
      return;
    }
    const account = users[email] || {
      email, password, username, role: 'Coach', name: entry.name || username, level: entry.level || 'Varsity'
    };
    users[email] = account;
    localStorage.setItem('cfhs-users', JSON.stringify(users));
    startSession(account);
    say('Signed in. Redirecting...', true);
    setTimeout(() => location.href = 'index.html', 600);
  });

  function startSession(account) {
    localStorage.setItem('cfhs-user-session', JSON.stringify({
      email: account.email,
      username: account.username,
      name: account.name,
      role: 'Coach'
    }));
    localStorage.removeItem('cfhs-admin-session');
  }
})();
