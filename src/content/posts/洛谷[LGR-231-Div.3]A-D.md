---
title: "洛谷[LGR-231-Div.3]A-D"
published: 2026-10-05
description: ""
image: "/covers/洛谷-LGR-231-Div-3-A-D.jpg"
tags: ["题目"]
category: "题解"
draft: true
lang: ""
pinned: false
---
主播后两题只能骗分QAQ

# A-改编：

正常模拟即可，记录一个flag判断是否全部题目都被抛弃。如果最后
flag状态依然没有更改，则判为全部抛弃.

<details>
<summary>点击查看代码</summary>

```cpp
# include<bits/stdc++.h>
using namespace std;
bool flag = true;
int n,k1,k2,cnt,a,x,y;
int main(){
    cin >> n >> k1 >> k2;
    for(int i = 1;i <= n;i++){
        cin >> a >> x >> y;
        if(x == 1 && y == 1) continue;
        if(x == 1) a -= k1;
        if(y == 1) a -= k2;
        if(a < 0) continue;
        cnt = max(cnt,a);
        flag = false;
    }
    if(flag) cout<< -1;
    else cout<< cnt;
    return 0;
}
```
</details>

# B-PVP(~~还是PVP大佬QWQ~~):

这题可以用分类讨论的思想解决，记录两个值 $endx$ 和 $endy$ 分别记录
玩家和怪物是在第几回合死去，如果最后没死则记为0.这里分成玩家最后死了和没死两种情况：

>
>
>
>

>
>
>
>
