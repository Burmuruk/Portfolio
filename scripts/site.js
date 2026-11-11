(() => {
  const normalize = text => text.replace(/\s+/g, ' ').trim();
  let language;
  try { language = localStorage.getItem('portfolio-language'); } catch (_) { /* Optional storage. */ }
  if (!['es', 'en'].includes(language)) {
    const preferred = navigator.languages?.[0] || navigator.language || 'en';
    language = preferred.toLowerCase().startsWith('es') ? 'es' : 'en';
  }

  function translate(text) {
    if (language === 'es') return text;
    const dictionary = window.portfolioEnglish;
    if (dictionary[text]) return dictionary[text];
    const caption = text.match(/^(\d{2} \/ )(.+)$/);
    if (caption) return caption[1] + translate(caption[2]);
    if (text.startsWith('Ampliar: ')) return 'Enlarge: ' + translate(text.slice(9));
    if (text.endsWith(' — vista del proyecto')) return translate(text.replace(' — vista del proyecto', '')) + ' — project preview';
    if (text.endsWith(' | David Santoyo Herrera')) return translate(text.split(' | ')[0]) + ' | David Santoyo Herrera';
    return text;
  }

  // Preserve text nodes, links and icons instead of replacing element HTML.
  const texts = [];
  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement?.closest('script, style, [data-theme-toggle], [data-language-toggle]')) continue;
    if (normalize(node.nodeValue)) texts.push([node, node.nodeValue]);
  }
  const attributes = [];
  document.querySelectorAll('[alt], [aria-label], meta[name="description"]').forEach(element => {
    if (element.matches('[data-theme-toggle], [data-language-toggle]')) return;
    for (const name of ['alt', 'aria-label', 'content']) {
      if (element.hasAttribute(name)) attributes.push([element, name, element.getAttribute(name)]);
    }
  });
  const languageButton = document.querySelector('[data-language-toggle]');
  function updateThemeLabel() {
    const dark = document.documentElement.dataset.theme === 'dark';
    document.querySelector('[data-theme-toggle]').setAttribute('aria-label', language === 'es'
      ? (dark ? 'Activar modo claro' : 'Activar modo oscuro')
      : (dark ? 'Switch to light mode' : 'Switch to dark mode'));
  }
  function applyLanguage() {
    document.documentElement.lang = language;
    texts.forEach(([node, original]) => {
      node.nodeValue = original.replace(/\S(?:[\s\S]*\S)?/, translate(normalize(original)));
    });
    attributes.forEach(([element, name, original]) => element.setAttribute(name, translate(original)));
    document.querySelectorAll('[data-cv]').forEach(link => {
      // Replace documents/Curriculum-en.pdf with the translated PDF when ready.
      link.href = link.dataset.root + 'documents/' + (language === 'en' ? 'Curriculum-en.pdf' : 'Curriculum.pdf');
      link.hreflang = language;
    });
    languageButton.textContent = language === 'es' ? 'EN' : 'ES';
    languageButton.lang = language === 'es' ? 'en' : 'es';
    languageButton.setAttribute('aria-label', language === 'es' ? 'Switch to English' : 'Cambiar a español');
    updateThemeLabel();
  }
  languageButton.addEventListener('click', () => {
    language = language === 'es' ? 'en' : 'es';
    try { localStorage.setItem('portfolio-language', language); } catch (_) { /* Session choice still works. */ }
    applyLanguage();
  });
  new MutationObserver(updateThemeLabel).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  document.addEventListener('DOMContentLoaded', updateThemeLabel);
  document.querySelector('[data-theme-toggle]').addEventListener('click', updateThemeLabel);
  applyLanguage();

  const panel = document.querySelector('[data-project-switcher]');
  if (panel) {
    const mobile = matchMedia('(max-width: 650px)');
    const resetPanel = () => { panel.open = !mobile.matches; };
    resetPanel();
    mobile.addEventListener('change', resetPanel);
    panel.addEventListener('keydown', event => {
      if (event.key === 'Escape' && panel.open) {
        panel.open = false;
        panel.querySelector('summary').focus();
      }
    });
  }

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('[data-preview]').forEach(card => {
    const image = card.querySelector('img');
    const sources = JSON.parse(card.dataset.preview);
    let timer, index = 0, active = false, generation = 0;
    const stop = () => {
      active = false;
      generation++;
      clearTimeout(timer);
      index = 0;
      image.src = sources[0];
    };
    const advance = async () => {
      const token = generation;
      index = (index + 1) % sources.length;
      const frame = new Image();
      frame.src = sources[index];
      try { await frame.decode(); } catch (_) { /* Keep the existing frame if an image fails. */ }
      if (!active || token !== generation) return;
      if (frame.naturalWidth) image.src = frame.src;
      timer = setTimeout(advance, 1600);
    };
    card.addEventListener('pointerenter', () => {
      if (!hover.matches || reducedMotion.matches || active) return;
      active = true;
      timer = setTimeout(advance, 1000);
    });
    card.addEventListener('pointerleave', stop);
    card.addEventListener('pointercancel', stop);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
    reducedMotion.addEventListener('change', stop);
    hover.addEventListener('change', stop);
  });
})();
