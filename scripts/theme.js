// Apply before styles load to avoid a flash of the wrong theme.
(() => {
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let saved;
  try { saved = localStorage.getItem('portfolio-theme'); } catch (_) { /* Storage may be disabled. */ }
  const apply = theme => {
    document.documentElement.dataset.theme = theme;
    const button = document.querySelector('[data-theme-toggle]');
    if (button) {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.setAttribute('aria-label', theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro');
      button.textContent = theme === 'dark' ? '☼' : '☾';
    }
  };
  apply(saved === 'light' || saved === 'dark' ? saved : preference.matches ? 'dark' : 'light');
  preference.addEventListener('change', event => {
    if (!saved) apply(event.matches ? 'dark' : 'light');
  });
  document.addEventListener('DOMContentLoaded', () => {
    apply(document.documentElement.dataset.theme);
    document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
      saved = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(saved);
      try { localStorage.setItem('portfolio-theme', saved); } catch (_) { /* Keep the session choice. */ }
    });
  });
})();
