const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function createNode(tag = 'div') {
  return {
    tagName: tag.toUpperCase(),
    children: [],
    dataset: {},
    hidden: false,
    textContent: '',
    style: {},
    append(...nodes) { this.children.push(...nodes); },
    appendChild(node) { this.children.push(node); return node; },
    replaceChildren(...nodes) { this.children = nodes; },
    setAttribute() {},
    getAttribute() { return null; },
    addEventListener() {},
    getBoundingClientRect() { return { top: 0, bottom: 1 }; },
    scrollIntoView() {}
  };
}

const ids = [
  'main-content', 'language-switch', 'statistics-status', 'random-greeting',
  'profile-name', 'profile-position', 'profile-affiliations', 'profile-emails',
  'profile-links', 'portrait', 'portrait-placeholder', 'section-nav', 'profile',
  'busuanzi_container_site_pv', 'busuanzi_container_site_uv',
  'busuanzi_value_site_pv', 'busuanzi_value_site_uv'
];
const nodes = Object.fromEntries(ids.map(id => [id, createNode()]));
const observed = [];
const scripts = [];
let observerCallback;

class MutationObserver {
  constructor(callback) { observerCallback = callback; }
  observe(node) { observed.push(node); }
  disconnect() {}
}

const document = {
  body: {
    append(script) {
      scripts.push(script.src);
      if (script.src.includes('ibruce')) {
        nodes.busuanzi_value_site_pv.textContent = '12';
        nodes.busuanzi_value_site_uv.textContent = '3';
        observerCallback();
      } else {
        script.onerror();
      }
    }
  },
  documentElement: createNode('html'),
  baseURI: 'https://yutaoling.github.io/',
  getElementById(id) { return nodes[id]; },
  createElement(tag) { return createNode(tag); },
  createTextNode(text) { return { textContent: text }; },
  querySelector() { return { content: '' }; },
  querySelectorAll() { return []; }
};

const context = {
  window: {}, document, MutationObserver,
  location: { hostname: 'yutaoling.github.io', hash: '' },
  localStorage: { getItem() { return null; }, setItem() {} },
  URL, URLSearchParams, Math, setTimeout, clearTimeout,
  requestAnimationFrame(callback) { callback(); }
};
context.window = context;
context.addEventListener = () => {};
vm.createContext(context);
for (const file of ['content.js', 'settings.js', 'main.js']) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
}

assert.deepEqual(scripts, [
  'https://busuanzi.icodeq.com/busuanzi/2.3/busuanzi.pure.mini.js',
  'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
]);
assert.equal(nodes['statistics-status'].hidden, true);
assert.equal(nodes.busuanzi_value_site_pv.textContent, '12');
assert.equal(nodes.busuanzi_value_site_uv.textContent, '3');
console.log('statistics fallback: ok');
