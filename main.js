(() => {
  'use strict';

  const content = window.homepageContent;
  const settings = window.homepageSettings;
  const languageKey = 'academic-homepage-language';
  const sectionOrder = ['about', 'research', 'education', 'experience', 'publications'];
  const main = document.getElementById('main-content');
  const languageButton = document.getElementById('language-switch');
  const status = document.getElementById('statistics-status');
  let language = 'zh';
  let statisticsState = 'statisticsUnavailable';

  try {
    if (localStorage.getItem(languageKey) === 'en') language = 'en';
  } catch {
    // 浏览器禁止存储时，语言切换仍然可用。
  }

  function showRandomGreeting() {
    const storageKey = 'academic-homepage-greeting';
    const phrases = settings.greetings?.length ? settings.greetings : ['Hello!'];
    let previous = '';
    try { previous = localStorage.getItem(storageKey); } catch { /* 无存储时仍可随机展示 */ }
    const alternatives = phrases.filter(phrase => phrase !== previous);
    const choices = alternatives.length ? alternatives : phrases;
    const greeting = choices[Math.floor(Math.random() * choices.length)];
    document.getElementById('random-greeting').textContent = greeting;
    try { localStorage.setItem(storageKey, greeting); } catch { /* 不影响页面显示 */ }
  }

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function safeLink(text, url) {
    if (!url) return null;
    try {
      const parsed = new URL(url, document.baseURI);
      if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) return null;
      const anchor = element('a', text);
      anchor.href = url;
      return anchor;
    } catch {
      return null;
    }
  }

  // 简介和单位名称支持 [链接文字](网址)，其他文字仍按纯文本显示。
  function linkedParagraph(text) {
    const paragraph = element('p');
    const pattern = /\[([^\]]+)\]\(([^\s)]+)\)/g;
    let cursor = 0;
    for (const match of text.matchAll(pattern)) {
      paragraph.append(document.createTextNode(text.slice(cursor, match.index)));
      paragraph.append(safeLink(match[1], match[2]) || document.createTextNode(match[0]));
      cursor = match.index + match[0].length;
    }
    paragraph.append(document.createTextNode(text.slice(cursor)));
    return paragraph;
  }

  function renderProfile(data) {
    const profile = data.profile;
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-position').textContent = profile.position;
    document.getElementById('profile-affiliations').replaceChildren(
      ...profile.affiliations.map(text => element('p', text))
    );
    document.getElementById('profile-emails').replaceChildren(
      ...profile.emails.map(email => {
        const line = element('p');
        line.append(safeLink(email.text || email.address, email.address ? `mailto:${email.address}` : '') || element('span', email.text));
        return line;
      })
    );
    document.getElementById('profile-links').replaceChildren(
      ...profile.links.map(link => {
        const item = element('li');
        item.append(safeLink(link.text, link.url) || element('span', `${link.text} (${data.labels.unfilled})`, 'unfilled-link'));
        return item;
      })
    );
    const portrait = document.getElementById('portrait');
    const placeholder = document.getElementById('portrait-placeholder');
    portrait.alt = profile.name;
    if (settings.portrait && !portrait.dataset.failed) {
      portrait.onerror = () => {
        portrait.dataset.failed = 'true';
        portrait.hidden = true;
        placeholder.hidden = false;
      };
      if (portrait.getAttribute('src') !== settings.portrait) portrait.src = settings.portrait;
      portrait.hidden = false;
      placeholder.hidden = true;
    }
  }

  function renderSection(id, data) {
    const section = element('section', undefined, 'content-section');
    section.id = id;
    section.setAttribute('aria-labelledby', `${id}-title`);
    const heading = element('h2', data.title);
    heading.id = `${id}-title`;
    section.append(heading);

    if (id === 'about') {
      const paragraphs = element('div', undefined, 'paragraphs');
      paragraphs.append(...data.paragraphs.map(linkedParagraph));
      section.append(paragraphs);
    } else if (id === 'research') {
      const list = element('ul', undefined, 'research-list');
      list.append(...data.items.map(text => element('li', text)));
      section.append(list);
    } else if (id === 'education' || id === 'experience') {
      const list = element('ul', undefined, 'history-list');
      list.append(...data.items.map(entry => {
        const item = element('li');
        const details = element('div');
        details.append(linkedParagraph(entry.institution), element('p', entry.detail));
        item.append(element('span', entry.period, 'history-period'), details);
        return item;
      }));
      section.append(list);
    } else if (id === 'publications') {
      const list = element('div', undefined, 'publication-list');
      list.append(...data.items.map(citation => element('p', citation)));
      section.append(list);
    }
    return section;
  }

  function render() {
    const data = content[language];
    document.documentElement.lang = data.lang;
    document.title = data.title;
    document.querySelector('meta[name="description"]').content = data.description;
    for (const node of document.querySelectorAll('[data-label]')) node.textContent = data.labels[node.dataset.label];
    for (const node of document.querySelectorAll('[data-logo]')) node.alt = data.labels.logos[node.dataset.logo];
    for (const link of document.querySelectorAll('[data-section]')) link.textContent = data.sections[link.dataset.section].title;
    document.getElementById('section-nav').setAttribute('aria-label', data.labels.navigation);
    document.getElementById('profile').setAttribute('aria-label', data.labels.profile);
    document.getElementById('visitor-map').setAttribute('aria-label', data.labels.visitorMap);
    languageButton.textContent = language === 'zh' ? 'English' : '中文';
    languageButton.lang = language === 'zh' ? 'en' : 'zh-CN';
    languageButton.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
    renderProfile(data);
    main.replaceChildren(...sectionOrder.map(id => renderSection(id, data.sections[id])));
    status.textContent = data.labels[statisticsState];
  }

  languageButton.addEventListener('click', () => {
    // 两种文字长度不同时，尽量保持当前栏目及阅读位置。
    const currentSection = [...main.children].find(section => section.getBoundingClientRect().bottom > 0);
    const offset = currentSection?.getBoundingClientRect().top;
    const restorePosition = window.scrollY > main.offsetTop;
    language = language === 'zh' ? 'en' : 'zh';
    try { localStorage.setItem(languageKey, language); } catch { /* 无存储也可切换 */ }
    render();
    if (restorePosition && currentSection) {
      const nextSection = document.getElementById(currentSection.id);
      window.scrollBy(0, nextSection.getBoundingClientRect().top - offset);
    }
  });

  function setStatisticsState(state) {
    statisticsState = state;
    status.textContent = content[language].labels[state];
  }

  function loadStatistics() {
    const config = settings.statistics;
    if (!config.enabled || !config.hostnames.includes(location.hostname)) return;
    setStatisticsState('statisticsLoading');
    const values = ['site_pv', 'site_uv'].map(key => document.getElementById(`busuanzi_value_${key}`));
    const observer = new MutationObserver(() => {
      if (values.some(node => node.textContent.trim())) {
        status.hidden = true;
        clearTimeout(timeout);
      }
      if (values.every(node => node.textContent.trim())) observer.disconnect();
    });
    for (const value of values) observer.observe(value, { childList: true, characterData: true, subtree: true });
    const timeout = setTimeout(() => setStatisticsState('statisticsUnavailable'), 10000);
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    script.onerror = () => {
      clearTimeout(timeout);
      observer.disconnect();
      setStatisticsState('statisticsUnavailable');
    };
    document.body.append(script);
  }

  function loadVisitorMap() {
    const config = settings.statistics;
    const localPreview = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)
      && new URLSearchParams(location.search).get('previewMap') === '1';
    if (!config.enabled || (!config.hostnames.includes(location.hostname) && !localPreview)) return;
    if (!config.mapMyVisitorsScriptUrl) return;
    try {
      const url = new URL(config.mapMyVisitorsScriptUrl);
      if (url.protocol !== 'https:' || url.hostname !== 'mapmyvisitors.com' || url.pathname !== '/map.js') return;
      const container = document.getElementById('visitor-map');
      const map = document.createElement('script');
      map.id = 'mapmyvisitors';
      map.async = true;
      map.src = url.href;
      map.onerror = () => { container.hidden = true; };
      container.hidden = false;
      container.append(map);
    } catch {
      // 未配置有效地图地址时，正文及访问计数仍正常工作。
    }
  }

  render();
  showRandomGreeting();
  window.addEventListener('pageshow', event => {
    if (event.persisted) showRandomGreeting();
  });
  // 正文生成后，处理直接带 #education 等锚点的链接。
  const initialSection = sectionOrder.find(id => location.hash === `#${id}`);
  if (initialSection) requestAnimationFrame(() => document.getElementById(initialSection).scrollIntoView());
  loadStatistics();
  loadVisitorMap();
})();
