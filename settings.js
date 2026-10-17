// 与正文无关的设置集中在这里。
window.homepageSettings = {
  // 主页照片路径；留空则显示矩形占位框。
  portrait: 'avatar.png',

  // 顶部随机问候语；每次打开或刷新选择一句，避免与上一次重复。
  // 中英文版本共用这份词库，可直接增删下面的短句。
  greetings: [
    'Hi!',
    'Hello!',
    'Welcome!',
    'Hello, world!',
    'Nice to meet you!',
    'Good to see you!',
    'Thanks for visiting!',
    'Glad you stopped by!',
    'Stay curious!',
    'Keep exploring!',
    'Have a great day!',
    'Welcome aboard!'
  ],

  statistics: {
    enabled: true,
    // 仅在正式域名加载统计，避免本地预览被计入访问量。
    // 如以后使用自定义域名，在此添加域名（不带 https://）。
    hostnames: ['yutaoling.github.io'],

    // MapMyVisitors 为本站生成的 JavaScript 嵌入地址。
    // 使用 HTTPS；本地可通过 /?previewMap=1 单独预览地图。
    // 留空时不显示地图，也不加载地图服务。
    mapMyVisitorsScriptUrl: 'https://mapmyvisitors.com/map.js?d=EnX6HSce8zrZv_Z9W8fPo0RHuxufV3NGfnkqE35w8Ak&cl=ffffff&w=a'
  }
};
