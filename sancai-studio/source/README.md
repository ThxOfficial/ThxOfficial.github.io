# 釉见唐彩 · 唐三彩数字创作工坊

二维卡通素坯的施釉、烧成与生活应用网站。独立于 `../caomu-rubu`，不读取或改写草木入布的作品。

## 运行

使用 Node.js 22.12+ 或 24。

```powershell
cd 'F:\研一课程\计算机科学与艺术\sancai-studio'
npm ci
npm run dev
```

打开终端显示的本地地址。依赖已安装时直接执行 `npm run dev`。

```powershell
npm run build
npm run preview
```

`npm run build` 包含 TypeScript 编译检查，并输出 `dist`；不是运行自动化测试。

## 当前可用

- 六款可上色素坯。包括确认过的短颈骏马、行驼、文官、守护俑、三彩执壶和三彩载乐驼。
- 前序成型/阴干/素烧说明；选部位、底釉、釉量、六组配色预览与采用。
- 点彩、菱格、流带：1—3 色、大小、疏密、方向与点彩位置；区域笔刷、清空装饰、整件还原和撤销重做。
- 三档烧成效果，支持跳过动画。成品可另烧一版，原作与配色会保留。
- 同一设计的素坯、施釉和烧成对照，保留完整白釉和素胎。
- 2048×2048 透明 PNG 或带可选背景色的 PNG，以及可缩放的 SVG 设计稿。要保留烧成光泽和流釉，请下载 PNG。
- 帆布袋、T 恤、手帕支持单图、重复铺排、双图拼贴和 1800×2000 PNG 导出。
- 拖动图案、调整位置/大小/旋转/布色，并保留每种产品设置。
- IndexedDB 自动保存、立即保存、本机作品集、复制修改、`.sancai.json` 备份和导入。
- 六种形象的阶段对照、河南唐三彩历史和工艺、可展开的文物介绍与馆方链接。
- 成品恢复等待/重试；保存失败时可下载备份，切换作品前明确处理未保存设计；390px 窄屏固定烧成入口。
- 成品与缩略图持久缓存；旧造型原样读取，并可将底釉和纹样带入重绘素坯的新副本。

## 简单使用

1. 首页“开始我的创作”，选择素坯，进入前序说明。
2. “素坯准备好了，去施釉”。从列表或图案选择部位，再选釉色。
3. 可选纹样、笔刷，或预览一组配色后采用；配色整体替换可撤销。
4. 选择交融程度，“送入窑中”。冷却出窑后命名、下载或进入布料页。
5. 当前浏览器会保存作品。跨设备编辑需下载项目备份；PNG 是作品图片，不能直接恢复编辑指令。

## 添加实物照片

把照片按指定文件名放进 [照片目录](src/assets/photos/README.md)。例如，首页照片可命名为 `overview.jpg`，三彩马可命名为 `horse.jpg`。浏览器会显示对应照片，点击可打开原图。静态发布前重新运行 `npm run build`。

Ctrl/Cmd+Z 撤销，Ctrl/Cmd+Shift+Z 重做，Ctrl/Cmd+S 立即保存。作品名称输入时保留原生文本快捷键。

旧作品可通过“用新造型再创作”换用重绘素坯：保留原作、底釉与参数纹样，自由笔触因轮廓不同需要重画。普通“复制并修改”继续沿用原造型。笔刷过程中可按 Escape 取消当前未提交笔触。

## 最新核对产物

- [用户确认的小马短颈对照](artifacts/screenshots/horse-neck-v5-shortened.png)
- [河南探索页](artifacts/screenshots/completed-explore-heritage.png)
- [透明形象 PNG](artifacts/completed-camel-transparent.png)
- [T 恤应用 PNG](artifacts/completed-camel-shirt.png)
- [可编辑示例项目](artifacts/completed-camel.sancai.json)
- [实施状态与检查范围](docs/IMPLEMENTATION_STATUS.md)
- [素材与来源](docs/ASSET_SOURCES.md)

成品图片与 JSON 来自浏览器实际创作与下载；小马对照使用网站同一渲染器。示例项目可在“我的作品 → 导入项目”打开为独立副本。

`artifacts/blue-horse*`、`artifacts/refined-horse*` 保留为历史造型示例，能继续导入。

## 技术说明

React + TypeScript + Vite + 原生 SVG/Canvas 2D + idb。模板 path 同时用于分区、遮罩和统一渲染；成品、下载和布料共用同一作品数据。流釉是固定种子的二维数字效果，不能用于预测实物烧制。

纯静态应用，没有登录、社区或云端作品库。当前没有公开部署；[部署准备](docs/DEPLOYMENT.md)说明如何集成个人主页子目录。
