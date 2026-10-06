---
title: "线段树？Lazytag?"
published: 2024-10-23
description: ""
image: "/covers/线段树-Lazytag_.jpg"
tags: ["算法"]
category: "算法笔记"
draft: false
lang: ""
pinned: false
---
# 本文导读：
  
  本博客主要介绍了线段树的原理和构造的过程，以及一些例题，如果有不足的点，欢迎指出qwq.

# 线段树 $(1)_{36}$:什么是线段树？
  
  作为一个蒟蒻qwq，看到 **"线段树"** 三个字时，你想到了什么？

  >蒟蒻：我知道！不就是 **"线段 + 树"**吗！
  >......
  >作者：哎呀，你到底在说什么，还是我来解释吧...

  1.线段树是一颗**二叉树**.

  2.线段树的节点记录了**一段区间的某个信息**(如总和，最大/最小值等).

  3.线段树的左右子结点记录的区间是有父节点所记录区间砍半所分配.

  如果你听过**树状数组**的话，你可能听说过一句话:

  >* 树状数组能做的事，线段树也能做.
  >
  >* 相比树状数组，线段树的**空间常数**比较大.

  那么，线段树能做什么呢？
  
  线段树最大的用处就是**维护一段区间**，并且能实时对区间进行修改和查询.

# 线段树 $(2)_{24}$:如何构建线段树？

  线段数的构建很容易写，不过在存储信息时需要注意几个问题：

  >1. 如果当前节点编号为**u**，那么左右子结点编号分别为**u * 2**和**u * 2 + 1**.
  >
  >2. 如果不是叶子节点，应当记录**左右节点合并的信息**!

  这里作者以区间和为例子，放出代码:
```cpp
int a[100005],n;
struct node{
	int l,r,sum;
}tree[400025];
void push_up(int u){
	tree[u].sum = tree[u << 1].sum + tree[u << 1 + 1].sum;
	return;
}
void build(int u,int l,int r){ //分别为当前节点编号，管理的区间。其中l和r为左闭右闭
	tree[u].l = l,tree[u].r = r;
	if(l == r){
		tree[u].sum = a[l];return;
	}else{
		int mid = (l + r) >> 1;
		build(u << 1,l,mid);
		build(u << 1 + 1,mid + 1,r);
		push_up(u);
	}
	return;
}
int main(){
	for(int i = 1;i <= n;i++) cin >> a[i];
	build(1,1,n);
	return 0;
}
```

>Q：push_up函数的作用？
>
>A：由于非叶子节点不能立即记录信息，所以我们要在给叶子节点存完信息后，**自底向上**,将信息传给更上的节点.
>
>Q: 为什么tree数组长度要开原数组长度的四倍？
>
>A: 假设n为**二的整数次幂**，那么就有 $n + n / 2 + n / 4+...+1=2n$个节点.如果不是，则必然还有一层，所以你懒得~~动态分配~~的话，数组长度要大于等于 $4n$.

那么我们的第一步就完成啦！

# 线段树 $(10)_{2}$:如何单点/区间查询?

  由于线段树不能直接调用查询区间的数据，所以我们需要用 **"凑"** 的形式得出我们需要的信息.
  
  查找区间分为以下几步：
  1.获取当前节点的左右子结点的区间.

  2.与目标区间做对比,如果目标区间在**左区间**，那么就**遍历左区间**，如果在**右区间**，则**遍历右区间**.
  >注：如果两个区间都有，那么都进行遍历，但是在返回信息时，要进行合并.
  
  3.如果当前区间被**目标区间包含**，那么直接返回当前区间信息.

  举个例子，有一个长度为8的数组，需要查找区间为 **[2,4]** 的区间和.

  >* 第一步，将原始区间分为了 **[1,4]**与**[5,8]**,发现左区间与目标相交，于是遍历区间 **[1,4]**.
  >
  >* 第二步，将区间**[1,4]**分为了 **[1,2]**和**[3,4]**,发现两个区间都与目标区间相交，于是都进行遍历.
  >
  >* 第三步, 将区间**[1,2]**分为了 **[1,1]**和**[2,2]**,发现右区间被目标区间包含，于是返回区间 **[2,2]**的信息.
  >
  >* 最后一步，发现区间 **[3,4]** 被目标区间包含，于是返回区间 **[3,4]** 的信息.

  那么这样，我们就做到了查询区间的操作，同时也附上区间和的代码:

```cpp
ll query(ll u,ll ml,ll mr,ll l,ll r){
    if(ml <= l && r <= mr) return tree[u]; // 如果被目标区间包含，则直接返回
    ll res = 0,mid = (l + r) >> 1;
    if(ml <= mid) res += query(u << 1,ml,mr,l,mid);
    if(mr > mid) res += query(u << 1 + 1,ml,mr,mid + 1,r);
    push_up(u);
    return res;
}
```

# 线段树 $(3)_{10}$ :单点修改：

  对于单点修改，我们采用与区间查询相似的方法，通过不断的分裂小区间，来找到最后符合的区间.
  
  这里不做过多赘述，放上代码.

```cpp
void update(ll u,ll l,ll r,ll ml,ll mr,ll x){
    if(ml <= l && r <= mr){
       tree[u] += x;return;
    }else{
        ll mid = (l + r) >> 1;
        if(ml <= mid) update(u << 1,l,mid,ml,mr,x);
        if(mr > mid) update(u << 1 + 1,mid + 1,r,ml,mr,x);
        push_up(u);
        return;
    }
}
```
</details>

# 线段树 $(11)_{3}$:线段树区间修改&Lazytag:

 那么经过了这么多讲解，我们来到了线段树的重头戏，也就是线段树最闪亮的点：Lazytag！

 如果你在线段树上要对一段区间进行修改，是不是想到立刻把每一个节点的值修改.

 >上帝:小伙子，你这么勤奋干什么？又没有要调用，你这么着急修改干什么，不如和我一起摸摸鱼...

 那么响彻上帝的发言，我们将采用叫做**Lazytag**的方法来实现.

  简单来说，Lazytag的总结就是：**还没调用就先别动，做个标记就可以了.**

 没错，只要还没有调用到这个节点，打死都不去更改，于是我们可以定义一个数组**tag**，记录节点被打上的标记，当进行查询时，就将当前节点的标记遗传下去，但只遗传到下一层.
  
 有了Lazytag的帮助，就可以写出区间查询的代码：
 ```cpp
void mtag(ll u,ll l,ll r,ll x){//给节点打上标记
    Lazytag[u] += x;
    tree[u] += (r - l + 1) * x;
    return;
}
void pdown(ll u,ll l,ll r){//遗传标记
    ll mid = (l + r) / 2;
    mtag(lu(u),l,mid,Lazytag[u]);
    mtag(ru(u),mid + 1,r,Lazytag[u]);
    Lazytag[u] = 0;
    return;
}
  void update(ll u,ll l,ll r,ll ml,ll mr,ll x){
    if(ml <= l && r <= mr){
        Lazytag[u] += x;
        tree[u] += (r - l + 1) * x;return;
    }else{
        pdown(u,l,r);
        ll mid = (l + r) >> 1;
        if(ml <= mid) update(lu(u),l,mid,ml,mr,x);
        if(mr > mid) update(ru(u),mid + 1,r,ml,mr,x);
        push_up_sum(u);
        return;
    }
}
```

同时这里也给上 [洛谷P3372](https://www.luogu.com.cn/problem/P3372) 的板子代码：
```cpp
# include<bits/stdc++.h>
# define ll long long
using namespace std;
ll Lazytag[400005],tree[400005],a[100005],u,v,w,x,n,m;
inline ll lu(ll u){return u << 1;}
inline ll ru(ll u){return u << 1 | 1;}
void push_up_sum(ll u){
    tree[u] = tree[lu(u)] + tree[ru(u)];
    return;
}
void build(ll u,ll l,ll r){
    Lazytag[u] = 0;
    if(l == r){
        tree[u] = a[l];return;
    }else{
        ll mid = (l + r) >> 1;
        build(lu(u),l,mid);
        build(ru(u),mid + 1,r);
        push_up_sum(u);
        return;
    }
}
void mtag(ll u,ll l,ll r,ll x){
    Lazytag[u] += x;
    tree[u] += (r - l + 1) * x;
    return;
}
void pdown(ll u,ll l,ll r){
    ll mid = (l + r) / 2;
    mtag(lu(u),l,mid,Lazytag[u]);
    mtag(ru(u),mid + 1,r,Lazytag[u]);
    Lazytag[u] = 0;
    return;
}
ll query(ll u,ll ml,ll mr,ll l,ll r){
    if(ml <= l && r <= mr) return tree[u];
    ll res = 0,mid = (l + r) >> 1;
    pdown(u,l,r);
    if(ml <= mid) res += query(lu(u),ml,mr,l,mid);
    if(mr > mid) res += query(ru(u),ml,mr,mid + 1,r);
    push_up_sum(u);
    return res;
}
void update(ll u,ll l,ll r,ll ml,ll mr,ll x){
    if(ml <= l && r <= mr){
        Lazytag[u] += x;
        tree[u] += (r - l + 1) * x;return;
    }else{
        pdown(u,l,r);
        ll mid = (l + r) >> 1;
        if(ml <= mid) update(lu(u),l,mid,ml,mr,x);
        if(mr > mid) update(ru(u),mid + 1,r,ml,mr,x);
        push_up_sum(u);
        return;
    }
}
int main(){
    //freopen("test.in","r",stdin);
    //freopen("test.out","w",stdout);
    ios::sync_with_stdio(false);
    cin.tie(0);cout.tie(0);
    cin >> n >> m;
    for(int i = 1;i <= n;i++) cin >> a[i];
    build(1,1,n);
    while(m--){
        cin >> u;
        if(u == 1){
            cin >> v >> w >> x;
            update(1,1,n,v,w,x);
        }else{
            cin >> v >> w;
            cout<<query(1,v,w,1,n)<<'\n';
        }
    }
}
```
-----------------------------------------------------------分割线---------------------------------------------------------------------
谢谢观看！
