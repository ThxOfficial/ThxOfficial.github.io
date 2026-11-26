# 把完整项目放进个人主页的 `sancai-studio/`

使用现有的 `你的用户名.github.io` 仓库。按下面的结构提交后，访问地址是 `https://你的用户名.github.io/sancai-studio/`。

先在 GitHub 打开个人主页仓库，进入 **Settings → Pages → Build and deployment**。如果 **Source** 是 **Deploy from a branch**，按下方「分支发布」操作。如果是 **GitHub Actions**，使用后面的 Actions 小节。已有主页沿用当前发布配置。[GitHub Pages 发布来源说明](https://docs.github.com/zh/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 分支发布

### 1. 确认文件放在哪个分支和目录

| Pages 的发布目录 | 仓库中要创建的目录 | 上线地址 |
| --- | --- | --- |
| `/(root)` | `sancai-studio/` | `https://你的用户名.github.io/sancai-studio/` |
| `/docs` | `docs/sancai-studio/` | `https://你的用户名.github.io/sancai-studio/` |

把完整的可构建源码放在项目目录内的 `source/`，构建产物放在项目目录的最外层：

```text
个人主页发布目录/
├── 原主页文件
└── sancai-studio/
    ├── index.html              npm run build 生成的网页入口
    ├── assets/                 构建后的 JS、CSS 和照片
    └── source/
        ├── index.html          Vite 的源码入口
        ├── package.json
        ├── package-lock.json
        ├── tsconfig.json
        ├── vite.config.ts
        ├── src/
        ├── scripts/
        ├── docs/
        └── README.md
```

GitHub Pages 分支发布会提供现成的网页文件。只复制 Vite 源码后，浏览器会拿到引用 `/src/main.tsx` 的入口，页面通常会白屏。若把构建入口留在 `sancai-studio/dist/index.html`，目标地址也读不到它。目标地址应直接对应构建后的 `sancai-studio/index.html`。源码和网页都能保存在同一个项目目录里。[Vite 静态部署说明](https://vite.dev/guide/static-deploy.html#building-the-app)

### 2. 构建并复制完整项目

把下面的 `$homepageRepo` 和 `$publishBranch` 改成你的本地个人主页仓库路径和 Pages 中显示的分支名。`$publishFolder` 只填 `'/'` 或 `'/docs'`。如果尚未克隆个人主页仓库，可先用 `git clone https://github.com/你的用户名/你的用户名.github.io.git` 获取本地副本。

本机使用 Node.js 22.12 或更新的 22.x 版本，也可使用 Node.js 24。先加入打算公开的实物照片，再运行以下 PowerShell 命令。[实物照片的文件名对照表](../src/assets/photos/README.md)

```powershell
$ErrorActionPreference = 'Stop'

$localProject = 'F:\研一课程\计算机科学与艺术\sancai-studio'
$homepageRepo = 'F:\sites\你的用户名.github.io'
$publishBranch = 'main'
$publishFolder = '/'   # 如果 Pages 选择 /docs，就改成 '/docs'

Set-Location -LiteralPath $homepageRepo
git switch $publishBranch
if ($LASTEXITCODE -ne 0) { throw '无法切换到 Pages 发布分支，请核对分支名。' }

Set-Location -LiteralPath $localProject
npm ci
if ($LASTEXITCODE -ne 0) { throw '依赖安装失败。' }
npm run build
if ($LASTEXITCODE -ne 0) { throw '构建失败，请处理终端中的报错。' }

$projectPath = if ($publishFolder -eq '/docs') {
    'docs/sancai-studio'
} else {
    'sancai-studio'
}
$published = Join-Path $homepageRepo $projectPath
$projectSource = Join-Path $published 'source'
$buildOutput = Join-Path $localProject 'dist'
New-Item -ItemType Directory -Force -Path $projectSource | Out-Null

$sourceEntries = @(
    'src', 'scripts', 'docs', 'index.html',
    'package.json', 'package-lock.json', 'tsconfig.json',
    'vite.config.ts', 'README.md', '.gitignore'
)
foreach ($entry in $sourceEntries) {
    Copy-Item -LiteralPath (Join-Path $localProject $entry) -Destination $projectSource -Recurse -Force
}
Copy-Item -LiteralPath (Join-Path $buildOutput 'index.html') -Destination $published -Force
Copy-Item -LiteralPath (Join-Path $buildOutput 'assets') -Destination $published -Recurse -Force

Set-Location -LiteralPath $homepageRepo
Get-ChildItem -LiteralPath $published -Force
git status --short
```

复制成功后，项目目录最外层有 `index.html`、`assets/` 和 `source/`。这组命令只复制可构建的项目文件。依赖由 `npm ci` 恢复，本地导出作品和调试资料留在原项目目录。分支发布目录里的源码可被访客访问，放入此处的照片也会随网站公开。[GitHub Pages 发布可见性](https://docs.github.com/zh/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

如果上次已把完整项目直接放进了项目目录，先检查仓库是否还有要保留的独立修改。上面的两次复制会把原始入口放进 `source/`，再用构建入口替换项目目录最外层的 `index.html`。

### 3. 提交并确认上线

继续使用同一个 PowerShell 窗口。确认输出中的项目路径正确，然后提交并推送：

```powershell
git add -- $projectPath
git diff --cached --stat -- $projectPath
git commit -m "Publish Tang Sancai studio" -- $projectPath
git push origin $publishBranch
```

到 GitHub 仓库的 **Actions** 查看最新 Pages 部署。部署成功后打开 `https://你的用户名.github.io/sancai-studio/`。也可以在原个人主页加一个链接，目标填 `/sancai-studio/`。[GitHub Pages 站点访问说明](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#viewing-your-published-site)

## 已用 GitHub Actions 发布主页

将完整项目源码放到个人主页仓库根目录的 `sancai-studio/`，让 `sancai-studio/package.json` 和 `sancai-studio/index.html` 直接可见。源码可使用上面的 `$sourceEntries` 列表复制。Actions 会构建出站文件，因此源码入口和线上入口可以分别存放。

在**现有工作流**里，找到上传 Pages artifact 的步骤和其 `path`。在主页构建完成之后、上传之前，加上以下步骤。这个片段适用于已有 Node.js 22.12+ 或 24 环境的 Ubuntu 工作流。把 `_site` 改成现有上传步骤使用的目录，保留原来的上传和部署步骤。如果上传路径是 `.`（整个仓库），先把主页文件准备到一个单独的发布目录，再将下方的 `PAGES_OUTPUT` 和上传步骤的 `path` 都指向它，避免把安装后的依赖一起上传。

```yaml
- name: Build Sancai Studio
  working-directory: sancai-studio
  run: |
    npm ci
    npm run build

- name: Add Sancai Studio to the homepage
  env:
    PAGES_OUTPUT: _site
  run: |
    test -d "$PAGES_OUTPUT"
    mkdir -p "$PAGES_OUTPUT/sancai-studio"
    cp -R sancai-studio/dist/. "$PAGES_OUTPUT/sancai-studio/"
    test -f "$PAGES_OUTPUT/sancai-studio/index.html"
```

例如原上传步骤的 `path` 为 `dist`，这里就填 `PAGES_OUTPUT: dist`，保留的首页依然是原产物中的 `dist/index.html`。上传包内的 `sancai-studio/index.html` 对应线上子路径。推送到原工作流触发的分支，再到 Actions 确认部署绿色通过。[GitHub Pages 自定义工作流](https://docs.github.com/zh/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)

## 部署失败时按现象排查

| 现象 | 先看哪里 |
| --- | --- |
| 个人主页正常，`/sancai-studio/` 返回 404 | 在 **实际发布的分支和目录**确认有 `sancai-studio/index.html`。如果用 Actions，检查最后上传的目录，而非只看仓库源码。 |
| 子页面能打开，但全白 | 在浏览器查看网页源代码。正确的入口应引用 `./assets/index-…js`；若看到 `/src/main.tsx`，应把最外层的入口换成 `dist/index.html`。 |
| 控制台提示 JS 或 CSS 404 | 入口与 `assets/` 必须来自同一次构建。检查 `index.html` 中引用的文件名，确认该文件随提交或上传包一起出现。 |
| 部署工作流失败 | 从仓库 **Actions** 打开最新失败的 Pages 任务，查看第一个报错。确认该提交位于发布分支。 |

本项目的 Vite 配置已经使用相对资源路径 `base: './'`，站内路由也使用 `#`。部署成功后，再打开 `/sancai-studio/#/explore` 并刷新核对。如果需要把本地预览里的作品带到线上，可在本地下载 `.sancai.json`，再在网站的「我的作品」中导入。[GitHub Pages 404 排查说明](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites)

以后更新时，重新构建，并把同一版本的 `source/`、`index.html` 和 `assets/` 一起提交。Actions 发布只需提交源码，由工作流重新构建。
