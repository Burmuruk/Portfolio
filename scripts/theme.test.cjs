const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = readFileSync(require('node:path').join(__dirname, 'theme.js'), 'utf8');
function setup(saved, dark, blocked = false) {
  const events = {}, attributes = {}, stored = {};
  const button = { setAttribute: (key, value) => attributes[key] = value, addEventListener: (key, fn) => events[key] = fn };
  const document = { documentElement: { dataset: {} }, querySelector: () => button, addEventListener: (_, fn) => events.ready = fn };
  vm.runInNewContext(source, {
    document,
    window: { matchMedia: () => ({ matches: dark, addEventListener: (_, fn) => events.system = fn }) },
    localStorage: {
      getItem: () => { if (blocked) throw Error('Disabled'); return saved; },
      setItem: (key, value) => { if (blocked) throw Error('Disabled'); stored[key] = value; }
    }
  });
  events.ready();
  return { events, attributes, stored, theme: () => document.documentElement.dataset.theme };
}
for (const dark of [false, true]) {
  const app = setup(null, dark);
  assert.equal(app.theme(), dark ? 'dark' : 'light');
  app.events.system({ matches: !dark });
  assert.equal(app.theme(), dark ? 'light' : 'dark');
  app.events.click();
  assert.equal(app.theme(), dark ? 'dark' : 'light');
  assert.equal(app.stored['portfolio-theme'], app.theme());
  assert.equal(app.attributes['aria-pressed'], String(dark));
  app.events.system({ matches: !dark });
  assert.equal(app.theme(), dark ? 'dark' : 'light');
}
assert.equal(setup('dark', false).theme(), 'dark');
assert.equal(setup('light', true).theme(), 'light');
const blocked = setup(null, true, true);
blocked.events.click();
assert.equal(blocked.theme(), 'light');
console.log('PASS: system preference, manual toggle, persistence, accessible state and blocked storage.');
