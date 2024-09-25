---
title: 关于本站
description: 一个轻量级的 Nuxt 主题，用于构建基于 Markdown 的网站，基于 Nuxt Content 和 TailwindCSS ✨
authors:
  - name: yuxinqi
    to: https://github.com/yuxinqi-chan
    avatar:
      src: https://avatars.githubusercontent.com/u/11438187?s=48&v=4
date: 2023-08-25
badge:
  label: 关于
sitemap:
  loc: /about
---

## 功能

- 利用 TailwindCSS Typography
- 使用 [Shiki](https://shiki.matsu.io) 高亮代码块
- 创建 Vue 组件并在 Markdown 中使用它们
- 部署在 Cloudflare Pages 上
- 在 [Nuxt Studio](https://nuxt.studio) 上实时编辑

## 设置

::button-link{:external=true href="https://stackblitz.com/github/yuxinqi-chan/content/tree/main/.demo?file=content%2F1.index.md" icon="i-simple-icons-stackblitz"}
在 Stackblitz 上在线体验
::

按照终端中的指示操作，你就可以开始了 🚀

## 使用

这个模板内置了一些功能，使创建内容驱动的网站变得尽可能简单。

### 页面

在 `content/` 目录中创建你的 Markdown 页面：

```md [content/about.md]
---
title: 关于本站
description: 一个轻量级的 Nuxt 主题，用于构建基于 Markdown 的网站，基于 Nuxt Content 和 TailwindCSS ✨
authors:
  - name: yuxinqi
    to: https://github.com/yuxinqi-chan
    avatar:
      src: https://avatars.githubusercontent.com/u/11438187?s=48&v=4
date: 2023-08-25
badge:
  label: 关于
---

## 次级标题

元标签内容将被用作页面标题和SEO。
```

这些内容通过 Nuxt Content 的 [Markdown](https://content.nuxt.com/usage/markdown) 进行解析。

### 图标

使用 [Nuxt UI](https://ui.nuxt.com/components/icon) 的 `<UIcon>` 组件从 [icones.js.org](https://icones.js.org) 中使用任何图标：

```html
<UIcon name="i-ph-music-notes-fill" />
```

你也可以在 Markdown 中使用它：

```md
:u-icon{name="i-ph-music-notes-fill"}
```

将会显示为 :u-icon{name="i-ph-music-notes-fill"}

了解更多请查看 [Nuxt UI](https://ui.nuxt.com/components/icon) 文档。

### 代码高亮

它支持使用 Shiki 进行代码高亮，并支持不同的 [VS Code 主题](https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes)。

::markdown-block
\`\`\`ts
export default () => 'Hello Content Wind'
\`\`\`
::

将会显示为：

```ts
export default () => "Hello Content Wind";
```

更新主题只需编辑你的 `nuxt.config`：

```ts
import { defineNuxtConfig } from "nuxt";

export default defineNuxtConfig({
  content: {
    highlight: {
      theme: "one-dark-pro",
    },
  },
});
```

在 [Content Code Highlight 部分](https://content.nuxt.com/get-started/configuration#highlight)了解更多。

在 [Nuxt 文档](https://nuxt.com/docs/getting-started/deployment) 中了解更多信息。
