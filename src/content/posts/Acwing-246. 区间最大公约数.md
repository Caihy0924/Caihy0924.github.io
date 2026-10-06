---
title: "Acwing-246. 区间最大公约数"
published: 2024-10-01
description: ""
image: "/covers/Acwing-246--区间最大公约数.jpg"
tags: ["题目", "数论"]
category: "题解"
draft: false
lang: ""
pinned: false
---
# 本蒟蒻的第二篇题解qwq.

## 题目大意:
  
  给定一个长度为 $N$ 的数组，需要在数组上进行**两种操作**:
    
1.```C  l  r  d```,表示把 $A[l],A[l+1],...,A[r]$ 都加上 $d$.

2.```Q  l  r```,表示询问 $A[l],A[l+1],...,A[r]$ 的最大公约数 $(GCD)$.

## 《普通的解法》：

   如果你是一个只会打暴力的小蒟蒻~~(就像我)~~,看到题目后，是不是就只能无奈的打开 IDE，
打起**暴力代码**了吗？拜托，那可是**暴力**啊，数据这么大，你怎么能这么**暴力地对待他呢**？

有一天，一名蒟蒻打开了这道题：
>蒟蒻:这不就是求最大公约数吗，还不简简单单！
>
>然而他完全没有注意到数据范围...
>
>半小时过去了...
>
>蒟蒻:哈，本地样例过了！我也有实力切困难题了！
>
>当提交后，发现**TLE**时...
>
>蒟蒻：伟大的出题人啊，你为什么要给那么大的数据范围？
>
>数据：那可不是，如果我不出这么大的数据范围，他还佩成为困难题吗？
>
>蒟蒻：www...我因为这道题白白浪费了半个小时，还不去~~写水题好~~...

~~所以上面这段对话告诉我们不要轻视数据范围qwq~~

## 标准解法+证明过程:
  
  在点进这道题之前，先问一句话，知道什么是**欧几里德算法**吗？

什么，你不知道？那还不快去[ 这篇网站 ](https://oi-wiki.org/math/number-theory/gcd/#%E6%AC%A7%E5%87%A0%E9%87%8C%E5%BE%97%E7%AE%97%E6%B3%95)补一下.

那么现在，你需要知道一个特性，一个关于**欧几里德算法**的一个特性:

* $\forall a,b\in N,a\le b\Longrightarrow gcd(a,b) = gcd(a,b - a)$

什么，你说**你不相信**？那我们不妨来证明一下：

令 $x,y \in N,d = gcd(x,y)$, $d_1 = \frac{x}{d},d_2 = \frac{y}{d}$,则 $d_1 \perp d_2$.

 1. 假设 $x = y$,则 $gcd(x,y) = gcd(x,0) = gcd(x,y - x)$.

 2. 假设 $x < y$,那么令 $d_3 = \frac{x}{d},d_4 = \frac{y - x}{d}$.

  * $d_3 = \frac{x}{d} = d_1$.

  * $d_4 = \frac{y - x}{d} = \frac{d_2 \cdot d - d_1 \cdot d}{d} = \frac{d \cdot (d_2 - d_1)}{d} = (d_2 - d_1)$

    令 $m = gcd(d_1,d_2 - d_1),a = \frac{d_1}{m},b = \frac{d_2 - d_1}{m}$.

    假设 $m > 1$,那么：
    $d_1 = m \cdot a,d_2 - d_1 = m \cdot b$
    $d_2 = (a + b) \cdot m$

  因为 $m > 1$,所以 $d_1 \perp d_2$ 为假，与前者产生矛盾.

  由于 $m = 1$,也就是 $d_1$ 和 $(d_2 - d_1)$ 互质,所以 $gcd(x,y) = gcd(x,y - x)$ 为真.

  没错，就证明完了.

  而根据数学归纳法，我们又能推出下面的式子:
  * $gcd(x,y,z) = gcd(x,gcd(y,z)) = gcd(x,gcd(y,z - y)) = gcd(x,y,z - y) = gcd(gcd(x,y),z - y) = gcd(gcd(x,y - x),z - y) = gcd(x,y - x,z - y)$.

  * $gcd(a_1,a_2,...,a_n) = ... = gcd(a_1,a_2 - a_1,...,a_n - a_{n - 1})$

  看到这个结构是不是很熟悉？没错，这不就是**差分**吗！
  
  于是这道题就很明显了，维护一个差分数组，区间修改则改为了单点修改，查询就...就什么？

  额...好像还是要遍历整个区间吧...

  这个时候，就得请出我们的线段树了！！

  没错，以查询和修改区间为名，与这道题可谓是~~天造地设~~，只需要让 $tree$ 节点存储当前区间的 最大公约数，那区间查询 $GCD$ 不绰绰有余了？

  不过，式子中的 $a_1$ 该怎么办？
  
  这个时候，$tree$还有一个东西要存，那就是当前区间之和.还记得差分的性质吗?

  * $a_n = b_0 + b_1 + b_2,..., + b_n$

  这不就退化成了**前缀和**吗？ 

  好了，废话不多说，上代码:
  ```cpp
  #include<bits/stdc++.h>
# define ll long long
using namespace std;
struct node{
    ll l,r;
    ll v,d;
}tree[2000005];
char c;
ll a[500005],b[500005],n,m,u,v,w;
inline ll lu(ll u){return u << 1;}//返回左子结点编号
inline ll ru(ll u){return u << 1 | 1;}//返回右子结点编号
ll gcd(ll a,ll b){//gcd函数，采用辗转相除法
    if(b == 0) return a; 
    else return gcd(b,a % b);
}
void push_up(ll u){
    tree[u].v = tree[lu(u)].v + tree[ru(u)].v;
    tree[u].d = gcd(tree[lu(u)].d,tree[ru(u)].d);
}
void build(ll u,ll l,ll r){//建树
    tree[u].l = l,tree[u].r = r;
    if(l == r){
        tree[u].v = b[l],tree[u].d = b[l];
        return;
    }else{
        ll mid = (l + r) >> 1;
        build(lu(u),l,mid);
        build(ru(u),mid + 1,r);
        push_up(u);
    }
}
void update(ll u,ll f,ll w){
    if(tree[u].l == f && tree[u].r == f){
        tree[u].d += w,tree[u].v += w;return;
    }else{
        ll mid = (tree[u].l + tree[u].r) >> 1;
        if(f <= mid) update(lu(u),f,w);
        if(f > mid) update(ru(u),f,w);
        push_up(u);
        return;
    }
}
ll query(ll u,ll ml,ll mr){ 
    if(tree[u].l >= ml && mr >= tree[u].r) return abs(tree[u].d);
    ll mid = (tree[u].l + tree[u].r) >> 1,res = 0;
    if(ml <= mid) res = gcd(res,query(lu(u),ml,mr));
    if(mr > mid) res = gcd(res,query(ru(u),ml,mr));
    return res;
}
ll query2(ll u,ll ml,ll mr){ // 求前缀和
    if(tree[u].l >= ml && tree[u].r <= mr) return tree[u].v;
    ll mid = (tree[u].l + tree[u].r) >> 1,res = 0;
    if(ml <= mid) res += query2(lu(u),ml,mr);
    if(mr > mid) res += query2(ru(u),ml,mr);
    return res;
}
int main(){
    ios::sync_with_stdio(false);//加快读入速度
    cin >> n >> m;
    for(ll i = 1;i <= n;i++){
        cin >> a[i];
        b[i] = a[i] - a[i - 1];//b为差分数组
    }
    build(1,1,n);
    while(m--){
        cin >> c;
        if(c == 'C'){
            cin >> u >> v >> w;
            update(1,u,w);
            if(v + 1 <= n) update(1,v + 1,w * -1);//防止单点修改时越界
        }else{
            cin >> u >> v;
            if(u == v){
                cout<<query2(1,1,u)<<'\n';//当区间只有一个元素时，答案为al
            }else{
                ll tmp = abs(query2(1,1,u));
                cout<<gcd(tmp,query(1,u + 1,v))<<'\n';
            }
        }
    }
    return 0;
}
```
这次写的有些急，有问题还请多多指出，谢谢！qwq
