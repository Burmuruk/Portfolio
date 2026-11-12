const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, 'chapters.js'), 'utf8');
const settings = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'portfolio-config.js'), 'utf8'), settings);
const ids = new Set();
for (const chapter of settings.window.portfolioConfig.chapters) {
  assert.ok(!ids.has(chapter.id), 'Chapter identifiers must be unique'); ids.add(chapter.id);
  assert.ok(chapter.title.es && chapter.title.en);
  assert.ok(chapter.startSeconds === null || (Number.isFinite(chapter.startSeconds) && chapter.startSeconds >= 0));
  for (const resource of [chapter.image, chapter.href]) assert.ok(fs.existsSync(path.join(__dirname, '..', resource)), resource);
}
function setup({ ready = 1, reject = false, url = null } = {}) {
  class Element {
    constructor() { this.children = []; this.dataset = {}; this.events = {}; this.attributes = {}; this.textContent = ''; }
    append(...nodes) { this.children.push(...nodes); }
    setAttribute(k,v) { this.attributes[k] = v; }
    getAttribute(k) { return this.attributes[k]; }
    addEventListener(k,fn) { this.events[k] = fn; }
    removeEventListener(k,fn) { if (this.events[k] === fn) delete this.events[k]; }
    querySelectorAll() { return this.children.filter(c => 'extraChapter' in c.dataset); }
  }
  const list = new Element(), status = new Element(), note = new Element(), toggle = new Element(), repository = new Element(), language = new Element();
  const video = new Element(); Object.assign(video, { readyState: ready, networkState: 1, duration: 120, currentTime: 0, plays: 0, loads: 0,
    focus() {}, scrollIntoView() {}, load() { this.loads++; this.networkState = 2; }, play() { this.plays++; return reject ? Promise.reject(Error()) : Promise.resolve(); } });
  const chapters = [null, 0, 41, 999].map((startSeconds, i) => ({id:String(i), title:{es:'Proyecto '+i,en:'Project '+i},image:'img/optimized/RPGProfile.webp',startSeconds,href:'pages/RPGStarterTemplate.html'}));
  const config = { chapters, initialChapterCount:3, reelSelectionConfirmed:false, rpgRepositoryUrl:url };
  const nodes = {'#chapter-list':list,'#DemoReelSection video':video,'.chapter-status':status,'.chapter-note':note,'.chapter-toggle':toggle,'[data-repository-link]':repository,'[data-language-toggle]':language};
  vm.runInNewContext(source, {window:{portfolioConfig:config,portfolioEnglish:{}},document:{documentElement:{lang:'es'},querySelector:s=>nodes[s],createElement:()=>new Element()},matchMedia:()=>({matches:true}),setTimeout:()=>1,clearTimeout:()=>{},URL});
  const click = i => list.children[i].children[2].children[0].events.click();
  return { list, status, video, toggle, repository, click };
}
(async () => {
  let a = setup();
  assert.equal(a.list.children[0].children[2].children[0].disabled, true);
  assert.equal(a.list.children[0].children[1].textContent, 'Tiempo pendiente');
  assert.equal(a.list.children[1].children[1].textContent, '0:00');
  assert.equal(a.list.children[3].hidden, true);
  a.toggle.events.click(); assert.equal(a.list.children[3].hidden, false);
  a.toggle.events.click(); assert.equal(a.list.children[3].hidden, true);
  a.click(0); assert.equal(a.video.plays, 0);
  a.click(2); assert.equal(a.video.currentTime, 41); assert.equal(a.video.plays, 1);
  a.click(1); assert.equal(a.video.currentTime, 0);
  a.click(3); assert.match(a.status.textContent, /fuera/); assert.equal(a.video.plays, 2);
  a = setup({ready:0}); a.click(1); a.click(2);
  assert.equal(a.video.loads, 1); assert.equal(a.video.plays, 0);
  a.video.readyState = 1; a.video.events.loadedmetadata();
  assert.equal(a.video.currentTime, 41); assert.equal(a.video.plays, 1);
  assert.equal(a.video.events.loadedmetadata, undefined);
  a = setup({reject:true}); a.click(1); await Promise.resolve();
  assert.match(a.status.textContent, /Pulsa reproducir/);
  assert.equal(setup().repository.children.length, 0);
  assert.equal(setup({url:'javascript:alert(1)'}).repository.children.length, 0);
  assert.equal(setup({url:'https://example.com/repository'}).repository.children.length, 1);
  console.log('PASS: pending timestamps, zero, expand/collapse, loaded/unloaded seeks, repeated requests, bounds, playback rejection and repository validation.');
})().catch(error=>{console.error(error);process.exitCode=1;});
