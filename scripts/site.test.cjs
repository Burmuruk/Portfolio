const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const translations = fs.readFileSync(path.join(__dirname, 'translations.js'), 'utf8');
const source = fs.readFileSync(path.join(__dirname, 'site.js'), 'utf8');

function setup({ saved, preferred = 'es-MX', mobile = false, reduced = false, blocked = false } = {}) {
  function element(attributes = {}) {
    return { attributes, events: {}, dataset: {}, setAttribute(k,v) { this.attributes[k] = v; },
      getAttribute(k) { return this.attributes[k]; }, hasAttribute(k) { return k in this.attributes; },
      addEventListener(k,fn) { this.events[k] = fn; }, matches() { return false; } };
  }
  const languageButton = element(), themeButton = element();
  const cv = element(); cv.dataset.root = '../';
  const alt = element({ alt: 'Sistemas de navegación — vista del proyecto' });
  const text = { nodeValue: '\n  Sistemas de navegación  ', parentElement: { closest: () => false } };
  const panel = element(); panel.open = true;
  let focused = false;
  panel.querySelector = () => ({ focus() { focused = true; } });
  const media = {};
  const matchMedia = query => media[query] ??= { matches: query.includes('650px') ? mobile : query.includes('reduce') ? reduced : true,
    addEventListener(k, fn) { this.listener = fn; } };
  const image = { src: 'first.webp' }, card = element();
  card.dataset.preview = '["first.webp","second.webp"]'; card.querySelector = () => image;
  let nextTimer = 0;
  const timers = new Map();
  const document = { documentElement: { dataset: { theme: 'dark' } }, events: {}, hidden: false,
    querySelector(selector) { return selector === '[data-language-toggle]' ? languageButton : selector === '[data-theme-toggle]' ? themeButton : panel; },
    querySelectorAll(selector) { return selector === '[data-cv]' ? [cv] : selector === '[data-preview]' ? [card] : [alt]; },
    createTreeWalker() { let visited = false; return { currentNode: text, nextNode() { if (visited) return false; visited = true; return true; } }; },
    addEventListener(k, fn) { this.events[k] = fn; }
  };
  const storage = { 'portfolio-language': saved };
  const context = { window: {}, document, navigator: { languages: [preferred] }, NodeFilter: { SHOW_TEXT: 4 }, matchMedia,
    MutationObserver: class { observe() {} },
    Image: class { constructor() { this.naturalWidth = 100; } async decode() {} },
    setTimeout(fn) { const id = ++nextTimer; timers.set(id, fn); return id; }, clearTimeout(id) { timers.delete(id); },
    localStorage: { getItem: k => { if (blocked) throw Error('Storage disabled'); return storage[k]; },
      setItem: (k,v) => { if (blocked) throw Error('Storage disabled'); storage[k] = v; } }
  };
  vm.createContext(context); vm.runInContext(translations, context); vm.runInContext(source, context);
  return { document, cv, alt, text, storage, languageButton, themeButton, panel, card, image, timers, media, focused: () => focused };
}

(async () => {
  let app = setup();
  assert.equal(app.document.documentElement.lang, 'es');
  app.languageButton.events.click();
  assert.equal(app.document.documentElement.lang, 'en');
  assert.equal(app.text.nodeValue, '\n  Navigation systems  ');
  assert.equal(app.alt.attributes.alt, 'Navigation systems — project preview');
  assert.equal(app.cv.href, '../documents/Curriculum-en.pdf');
  assert.equal(app.themeButton.attributes['aria-label'], 'Switch to light mode');
  assert.equal(app.storage['portfolio-language'], 'en');
  app.languageButton.events.click();
  assert.equal(app.text.nodeValue, '\n  Sistemas de navegación  ');
  assert.equal(app.cv.href, '../documents/Curriculum.pdf');
  assert.equal(setup({ preferred: 'en-US' }).document.documentElement.lang, 'en');
  assert.equal(setup({ preferred: 'fr-FR' }).document.documentElement.lang, 'en');
  assert.equal(setup({ saved: 'es', preferred: 'en-US' }).document.documentElement.lang, 'es');
  assert.equal(setup({ saved: 'invalid', preferred: 'es-ES' }).document.documentElement.lang, 'es');
  const blocked = setup({ blocked: true }); blocked.languageButton.events.click();
  assert.equal(blocked.document.documentElement.lang, 'en');
  assert.equal(setup({ mobile: true }).panel.open, false);
  assert.equal(app.panel.open, true);
  app.panel.events.keydown({ key: 'Escape' });
  assert.equal(app.panel.open, false); assert.equal(app.focused(), true);
  app.card.events.pointerenter();
  await [...app.timers.values()][0]();
  assert.equal(app.image.src, 'second.webp');
  app.card.events.pointerleave();
  assert.equal(app.image.src, 'first.webp');
  const still = setup({ reduced: true }); still.card.events.pointerenter();
  assert.equal(still.timers.size, 0);
  console.log('PASS: language detection, override, English CV, translation roundtrip, storage fallback, mobile sidebar, Escape and hover previews.');
})().catch(error => { console.error(error); process.exitCode = 1; });
