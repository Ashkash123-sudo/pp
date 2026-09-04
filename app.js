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

});
