# 我的博客

用 Hugo 生成、部署在 GitHub Pages 上的静态博客。**主题就在本项目的 `layouts/` 和 `assets/` 里，没有依赖任何外部主题仓库。**

## 目录说明

```
.
├── content/              文章内容
│   ├── _index.md         首页文案
│   ├── about.md          关于页
│   └── posts/            所有文章都放这里
├── layouts/              主题（页面模板）
│   ├── _default/         baseof / single / list
│   ├── partials/         head / header / footer / post-list
│   └── shortcodes/       note.html 提示框
├── assets/css/
│   ├── main.css          主题样式
│   └── custom.css        你自己的样式，改这里最安全
├── static/               favicon 等原样拷贝的文件
├── hugo.toml             站点配置：标题、菜单、网址
└── .github/workflows/hugo.yml   自动构建并发布
```

## 本地预览（可选）

不装 Hugo 也能发布，因为构建是在 GitHub 的服务器上做的。想在本地实时预览，就装一下 Hugo extended 版，然后在项目根目录运行：

```bash
hugo server -D
```

打开 http://localhost:1313 就能看效果，改文件会立刻刷新。

## 写一篇新文章

在 `content/posts/` 里新建 `我的标题.md`：

```markdown
---
title: "标题"
date: 2026-10-05
tags: ["标签"]
summary: "列表页显示的简介。"
---

正文……
```

然后 `git add . && git commit -m "post: 新文章" && git push`，等一两分钟即可。

## 常用改动

| 想改什么 | 改哪里 |
| --- | --- |
| 站点标题、简介、菜单 | `hugo.toml` |
| 配色、字号、行距 | `assets/css/custom.css` |
| 页面结构、文章模板 | `layouts/` 下的对应文件 |
| 首页文案 | `content/_index.md` |
| 关于页 | `content/about.md` |

## 部署

推到 `main` 分支后，GitHub Actions 自动执行 `.github/workflows/hugo.yml`：装 Hugo → 构建 → 上传 → 发布到 Pages。

第一次要在仓库的 **Settings → Pages → Source** 里把来源选成 **GitHub Actions**。
