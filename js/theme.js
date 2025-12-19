(function(){
  const THEME_KEY = 'site-theme';

  function applyTheme(theme){
    if(theme === 'dark'){
      document.documentElement.setAttribute('data-color-scheme','dark');
    } else {
      document.documentElement.setAttribute('data-color-scheme','light');
    }
    localStorage.setItem(THEME_KEY, theme);
    updateToggleIcon(theme);
  }

  function getSavedOrPreferred(){
    const saved = localStorage.getItem(THEME_KEY);
    if(saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function updateToggleIcon(theme){
    const btn = document.getElementById('themeToggle');
    if(!btn) return;
    const icon = btn.querySelector('i');
    if(!icon) return;
    if(theme === 'dark'){
      icon.className = 'fas fa-sun';
      btn.title = 'Switch to light mode';
    } else {
      icon.className = 'fas fa-moon';
      btn.title = 'Switch to dark mode';
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    const theme = getSavedOrPreferred();
    applyTheme(theme);

    const btn = document.getElementById('themeToggle');
    if(btn){
      btn.addEventListener('click', function(){
        const current = document.documentElement.getAttribute('data-color-scheme') === 'dark' ? 'dark' : 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    // Watch for system changes if user hasn't explicitly set a preference
    if(!localStorage.getItem(THEME_KEY) && window.matchMedia){
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        applyTheme(e.matches ? 'dark' : 'light');
      });
    }
  });
})();
