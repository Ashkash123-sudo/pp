// auth-utils.js - small client-side role helpers for the static demo
(function () {
  window.CFHSAuth = {
    isAdmin() {
      try { return !!JSON.parse(localStorage.getItem('cfhs-admin-session') || 'null'); } catch { return false; }
    },
    isCoach() {
      try { const s = JSON.parse(localStorage.getItem('cfhs-user-session') || 'null'); return !!(s && s.role === 'Coach'); } catch { return false; }
    },
    currentUser() {
      try { return JSON.parse(localStorage.getItem('cfhs-user-session') || 'null'); } catch { return null; }
    },
    requireAdmin() {
      if (!this.isAdmin()) { alert('Administrator access required.'); return false; }
      return true;
    },
    requireAdminOrCoach() {
      if (!this.isAdmin() && !this.isCoach()) { alert('Only coaches or administrators can perform this action.'); return false; }
      return true;
    }
  };
})();
