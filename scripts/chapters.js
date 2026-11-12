(() => {
  const config = window.portfolioConfig;
  const validTime = s => typeof s === 'number' && Number.isFinite(s) && s >= 0;
  const formatTime = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const element = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  };
  const localize = (es, en) => document.documentElement.lang === 'en' ? en : es;
  const list = document.querySelector('#chapter-list');
  if (list) {
    const video = document.querySelector('#DemoReelSection video');
    const status = document.querySelector('.chapter-status');
    const note = document.querySelector('.chapter-note');
    if (config.reelSelectionConfirmed) note.textContent = config.chapters.some(c => !validTime(c.startSeconds)) ? 'Tiempos por confirmar.' : '';
    if (!note.textContent) note.hidden = true;
    const initialCount = Math.max(1, Math.floor(config.initialChapterCount) || 3);
    let requestId = 0, disposeWait = () => {};
    function playChapter(seconds) {
      const id = ++requestId;
      disposeWait();
      status.textContent = '';
      const report = (es, en) => { if (id === requestId) status.textContent = localize(es, en); };
      function seekAndPlay() {
        if (id !== requestId) return;
        if (Number.isFinite(video.duration) && seconds >= video.duration) {
          report('Este capítulo está fuera de la duración del video.', 'This chapter is outside the video duration.');
          return;
        }
        try {
          video.currentTime = seconds;
          video.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
          video.focus({ preventScroll: true });
          video.play()?.catch(() => report('Pulsa reproducir en el video para continuar.', 'Press play on the video to continue.'));
        } catch (_) {
          report('No se pudo abrir este momento. Intenta reproducir el video.', 'Could not open this moment. Try playing the video.');
        }
      }
      if (video.readyState >= 1) { seekAndPlay(); return; }
      report('Cargando video…', 'Loading video…');
      const loaded = () => { disposeWait(); status.textContent = ''; seekAndPlay(); };
      const failed = () => { disposeWait(); report('No se pudo cargar el video. Inténtalo de nuevo.', 'The video could not be loaded. Please try again.'); };
      const timeout = setTimeout(failed, 20000);
      disposeWait = () => {
        clearTimeout(timeout);
        video.removeEventListener('loadedmetadata', loaded);
        video.removeEventListener('error', failed);
      };
      video.addEventListener('loadedmetadata', loaded);
      video.addEventListener('error', failed);
      // Reuse the existing HTML5 player; avoid restarting an in-progress load.
      if (video.networkState !== 2) video.load();
    }
    config.chapters.forEach((chapter, index) => {
      window.portfolioEnglish[chapter.title.es] = chapter.title.en;
      const card = element('article', 'chapter-card');
      card.dataset.chapter = chapter.id;
      if (index >= initialCount) { card.hidden = true; card.dataset.extraChapter = ''; }
      const top = element('div', 'chapter-top');
      const image = element('img');
      image.src = chapter.image; image.alt = ''; image.setAttribute('aria-hidden', 'true');
      image.width = 80; image.height = 54; image.loading = 'lazy';
      const heading = element('div', 'chapter-heading');
      heading.append(element('h3', '', chapter.title.es));
      if (chapter.tags?.length) {
        heading.append(element('p', 'chapter-tags', chapter.tags.join(' · ')));
      }
      top.append(image, heading);
      const pending = !validTime(chapter.startSeconds);
      const time = element('span', 'chapter-time', pending ? 'Tiempo pendiente' : formatTime(chapter.startSeconds));
      const actions = element('div', 'chapter-actions');
      const watch = element('button', '', 'Ver momento');
      watch.type = 'button'; watch.disabled = pending;
      if (pending) watch.title = 'Tiempo pendiente';
      watch.addEventListener('click', () => { if (validTime(chapter.startSeconds)) playChapter(chapter.startSeconds); });
      const link = element('a', '', 'Leer proyecto ↗'); link.href = chapter.href;
      actions.append(watch, link); card.append(top, time, actions); list.append(card);
    });
    const toggle = document.querySelector('.chapter-toggle');
    toggle.hidden = config.chapters.length <= initialCount;
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(expanded));
      list.querySelectorAll('[data-extra-chapter]').forEach(card => { card.hidden = !expanded; });
    });
    document.querySelector('[data-language-toggle]').addEventListener('click', () => { status.textContent = ''; });
  }
  const repository = document.querySelector('[data-repository-link]');
  const demo = document.querySelector('[data-demo-link]');
  if (demo && config.myVoxelShopDemoUrl) {
    try {
      const url = new URL(config.myVoxelShopDemoUrl);
      if (url.protocol === 'https:') {
        const link = element('a', 'button', 'Descargar demo para Android ↗');
        link.href = url.href; demo.append(link);
      }
    } catch (_) { /* Await a valid public URL. */ }
  }
  if (repository && config.rpgRepositoryUrl) {
    try {
      const url = new URL(config.rpgRepositoryUrl);
      if (url.protocol === 'https:') {
        const link = element('a', 'button', 'Repositorio y documentación ↗');
        link.href = url.href; repository.append(link);
      }
    } catch (_) { /* Unfinished URLs stay hidden. */ }
  }
})();
