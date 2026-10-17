# 学术主页

纯静态单页，使用 HTML、CSS 和 JavaScript，无 Jekyll、Ruby、npm 或构建依赖。默认中文，支持完整英文版本，语言选择保存在访客自己的浏览器中。

## 修改文字

编辑 `content.js`：`zh` 是中文，`en` 是英文。姓名、身份、单位、邮箱、个人链接和五个正文栏目都在这里，两份内容分别填写，不自动翻译。只修改引号内的文字即可；要增加经历或论文，复制同类条目，注意逗号。

- 邮箱：填写 `address`，同时把 `text` 改为显示文字。
- GitHub / Google Scholar：填写对应 `url`。空地址显示“待补充”，不会产生无效链接。
- 学术论文：`publications.items` 中每项直接填写一段完整引用，无需拆分作者、题目、期刊等字段。页面原样显示文字，不额外添加编号或标点。两个语言版本可使用同一段引用。
- 简介段落及教育 / 工作经历的单位名称支持 `[链接文字](https://网址)`，例如 `[付彦伟教授](https://yanweifu.github.io/)`。其余文字和论文引用按纯文本显示，不解析 HTML。包含单引号的句子可改用双引号包围。

## 顶部随机问候语

在 `settings.js` 的 `greetings` 数组中增删短句。每次打开或刷新页面随机展示一句；浏览器允许本地存储时，会避开上一次展示的短句。中英文版本共用词库，切换语言不更换问候语。桌面端在页首正中展示，窄屏下在校徽与语言按钮下方居中显示。

## 照片、校徽和字体

`settings.js` 的 `portrait` 当前为 `'avatar.png'`，使用根目录的主页照片。留空时显示照片占位框；照片加载失败时也会回到占位框。

校徽从左到右为西安交大、上海创智学院、复旦大学。根目录的 `xjtu.png`、`sii.png`、`fudan.png` 保留原图，页面加载 `assets/logos/` 中的 192px 展示副本。换校徽时可同时替换对应副本，或修改 `index.html` 的图片路径。macOS 可用以下命令生成副本：

```sh
sips -Z 192 xjtu.png --out assets/logos/xjtu.png
sips -Z 192 sii.png --out assets/logos/sii.png
sips -Z 192 fudan.png --out assets/logos/fudan.png
```

所有文字统一指定 `Microsoft YaHei`（微软雅黑），不提供字体文件下载。设备安装了微软雅黑时使用本机字体，否则由系统回退。正文、栏目标题和姓名使用 16 / 18 / 24px，顶部问候语为 36px 加粗，样式集中在 `styles.css`。

## 访问统计与地图

页尾使用[不蒜子](https://busuanzi.ibruce.info/)显示全站访问量及访客数。统计请求仅在 `settings.js` 中列出的正式域名启用；本地预览不计数。更换域名后请更新 `statistics.hostnames`。第三方服务不可用或被拦截时显示“访问统计暂不可用”，不填充虚假数值。切换语言不会再次加载统计脚本。

访客地图已接入 [MapMyVisitors](https://mapmyvisitors.com/) 的 JavaScript 小组件，本站专属地址在 `settings.js` 的 `statistics.mapMyVisitorsScriptUrl` 中。更换地图时填写生成代码中完整的 `https://mapmyvisitors.com/map.js?...` 地址，保留站点专属 ID；留空则关闭地图。地图异步加载，切换语言不会重新加载或重复计数。

本地默认不加载任何统计。要测试真实地图，打开 <http://127.0.0.1:8000/?previewMap=1>；此时仅启用 MapMyVisitors，不启用不蒜子。这是真实服务请求，可能被地图服务计入访问；普通预览地址不受影响。正式域名无需该参数，会自动显示地图。

## 本地预览

可以直接打开 `index.html`。推荐在目录中运行：

```sh
python3 -m http.server 8000
```

然后访问 <http://localhost:8000>。本地统计显示不可用是预期行为。

## 发布

提交并推送到 `main` 或 `master` 后，`.github/workflows/pages-deploy.yml` 会直接上传静态文件并发布到 GitHub Pages。仓库 Settings → Pages 的 Source 应为 **GitHub Actions**（沿用原项目的 Actions 部署方式）。无需安装主题或构建工具。

当前页面只引用文字、脚本、样式及校徽展示副本，头像原图和三校徽原图保留供后续替换。旧 Jekyll 配置、主题、博客栏目与开发容器已移除。`LICENSE` 保留原仓库的许可证。
