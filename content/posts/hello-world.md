---
title: "第一篇：把博客搬上线"
date: 2026-10-04
draft: false
tags: ["博客"]
summary: "记录一下这个站点是怎么搭起来的，以及以后怎么写新文章。"
---

终于有自己的小窝了。

这个博客用 [Hugo](https://gohugo.io/) 生成，托管在 GitHub Pages 上，每写一篇文章只要改一个 Markdown 文件，推上去就自动发布。

## 怎么写一篇新文章

在 `content/posts/` 下新建一个 Markdown 文件，开头写好这些信息：

```markdown
---
title: "标题"
date: 2026-10-05
tags: ["算法", "图论"]
summary: "列表页显示的一句话简介。"
---

正文用 Markdown 写就行。
```

然后提交、推送，GitHub Actions 会自动构建并发布，一两分钟后刷新就能看到。

## 代码块长这样

写代码用三个反引号包起来，记得标注语言：

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

## 还能用自定义的提示框

{{< note >}}
这是个普通的提示块，写法是 `{{</* note */>}}` 内容 `{{</* /note */>}}`。
{{< /note >}}

{{< note type="warn" >}}
加上 `type="warn"` 就变成警告样式，`type="danger"` 是危险样式。
{{< /note >}}
