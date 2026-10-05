# Caihy 的博客

个人博客，用 [Astro](https://astro.build/) + [Fuwari](https://github.com/saicaca/fuwari) 构建，托管在 GitHub Pages。

**线上地址：** https://caihy0924.github.io/

## 写一篇新文章

```bash
pnpm new-post 文章文件名
```

然后在 `src/content/posts/` 里找到它，开头这几行必须写：

```yaml
---
title: 标题
published: 2026-10-05
description: "一句话简介"
image: ""
tags: ["题目"]      # 题目 / 算法 / 数论
category: "题解"    # 题解 / 算法笔记 / 数学 / 游记 / 模板 / 随笔
draft: false
lang: ""
---
```

`draft: true` 的文章只会在本地预览里出现，不会被发布。

## 本地预览

```bash
pnpm install
pnpm dev
```

打开 http://localhost:4321

## 常用改动

| 想改什么 | 改哪里 |
| --- | --- |
| 站点标题、简介、菜单、横幅图 | `src/config.ts` |
| 首页横幅上的大标题和打字机文案 | `src/config.ts` 的 `bannerTextConfig` |
| 公告条文案 | `src/config.ts` 的 `announcementConfig` |
| 友链列表 | `src/config.ts` 的 `friendsConfig` |
| 评论区（giscus） | `src/config.ts` 的 `commentConfig` |
| 配色（虚空暗灰调） | `src/layouts/Layout.astro` 底部的 `:root:root` 段落 |
| 动态 / 说说 | 在 `src/content/dynamic/` 里丢 md 文件 |

## 部署

推到 `main` 分支即可。GitHub Actions 会自动装依赖、构建（含 Pagefind 搜索索引）并发布到 Pages。

流水线定义在 `.github/workflows/deploy.yml`。

## 主题

主题是 [Fuwari](https://github.com/saicaca/fuwari)（MIT 协议），已经根据个人喜好做过改造：自带主题、虚空粒子背景、横幅文案层、右侧栏挂件、一言、友链、动态等。
