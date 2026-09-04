// auth.js - simple client-side auth for demo purposes
(() => {
  const authForm = document.getElementById('authForm');
  const toggleMode = document.getElementById('toggleMode');
  const authTitle = document.getElementById('authTitle');
  const authIntro = document.getElementById('authIntro');
  const authMessage = document.getElementById('authMessage');
  const adminBtn = document.getElementById('adminLoginBtn');

  let isSignup = false;

  toggleMode.addEventListener('click', () => {
    isSignup = !isSignup;
    authTitle.textContent = isSignup ? 'Create account' : 'Sign in';
    toggleMode.textContent = isSignup ? 'Already have an account' : 'Create account';
    authForm.querySelector('.auth-button').textContent = isSignup ? 'Create account' : 'Sign in';
    authIntro.textContent = isSignup ? 'Create an account to follow teams, save preferences, and personalize your Panthers experience.' : 'Sign in to follow teams, save preferences, and personalize your Panthers experience.';
    authMessage.textContent = '';
  });

  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = (document.getElementById('authEmail').value || '').trim().toLowerCase();
    const password = document.getElementById('authPassword').value || '';
    if (!email || !password) {
      authMessage.textContent = 'Please provide email and password.';
      return;
    }

    const users = JSON.parse(localStorage.getItem('cfhs-users') || '{}');
    if (isSignup) {
      if (users[email]) {
        authMessage.textContent = 'An account with that email already exists.';
        return;
      }
      users[email] = { email, password, role: 'User' };
      localStorage.setItem('cfhs-users', JSON.stringify(users));
      localStorage.setItem('cfhs-user-session', JSON.stringify({ email, role: 'User' }));
      authMessage.textContent = 'Account created. Signed in.';
      setTimeout(() => location.href = 'index.html', 800);
      return;
    }

    if (!users[email] || users[email].password !== password) {
      authMessage.textContent = 'Invalid email or password.';
      return;
    }
    localStorage.setItem('cfhs-user-session', JSON.stringify({ email, role: users[email].role || 'User' }));
    authMessage.textContent = 'Signed in.';
    setTimeout(() => location.href = 'index.html', 500);
  });

  // Open the dedicated admin login page
  adminBtn.addEventListener('click', () => {
    window.location.href = 'admin-login.html';
  });
})();
