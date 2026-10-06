---
title: 换了个新家
published: 2026-10-05
description: "博客从 Hugo 搬到了 Astro + Fuwari，顺便把写文章的格式记一遍。"
image: "/covers/hello-world.jpg"
tags: ["算法"]
category: "随笔"
draft: false
lang: ""
pinned: true
---

终于把博客换成了 [Fuwari](https://github.com/saicaca/fuwari)——一个用 Astro 写的静态博客模板。以前那套是 Hugo，主题换来换去折腾了好几天，最后还是选了这个顺眼的。

这篇文章既是第一篇，也当备忘录用：以后忘了怎么写，翻回来看就行。

## 写一篇新文章

在项目根目录运行：

```bash
pnpm new-post 我的新文章
```

它会在 `src/content/posts/` 里生成一个带好开头的 Markdown 文件。开头这几行是必须的：

```yaml
---
title: 标题
published: 2026-10-05
description: "一句话简介，显示在列表和搜索结果里。"
image: ""
tags: ["算法", "图论"]
category: "随笔"
draft: false
---
```

写完推上去，GitHub Actions 会自动构建发布。

## 代码块

用三个反引号包起来，标注语言就会高亮：

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long n;
    cin >> n;
    cout << n * (n + 1) / 2 << '\n';
    return 0;
}
```

## 数学公式

行内写成 $O(n \log n)$，整行用两对美元符号：

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

动态规划的转移方程也能写：

$$
dp_{i,j} = \max\left(dp_{i-1,j},\ dp_{i-1,j-w_i} + v_i\right)
$$

## 提示框

> [!TIP]
> GitHub 风格的提示块，写成 `> [!TIP]` 开头就行。

> [!WARNING]
> 换成 `[!WARNING]` 是警告样式，还有 `[!NOTE]`、`[!IMPORTANT]`、`[!CAUTION]` 可以用。

## 内部链接

站内的文章可以用双中括号互相链接。写 `[[线段树]]`，就会渲染成 [[线段树]] 这样的链接。

想换显示的文字，中间加一根竖线：`[[最小生成树|MST 那篇]]` → [[最小生成树|MST 那篇]]。

链接的目标既可以是文章标题，也可以是文件名，都不用写扩展名。
