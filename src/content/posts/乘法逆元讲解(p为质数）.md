---
title: "乘法逆元讲解(p为质数）"
published: 2026-10-05
description: ""
image: "/covers/乘法逆元讲解-p为质数-.jpg"
tags: ["数论"]
category: "数学"
draft: true
lang: ""
pinned: false
---
# 本人数学不怎么好，有问题请指出qwq.

----------------------------------------------分割线-------------------------------------------------------

# 定义：
  
  如果存在三个数 $a,b,p$ 满足 $a \cdot b \equiv 1(mod\ p)$.那么我们称 $b$ 为 $a$ 的**乘法逆元**，记作 $a^{-1}$

  >注意！这里的 $a{-1}$ 是指 $a\ mod\ p$ 的乘法逆元，不是 $\frac{1}{a}$啊!

  那么，定义有了，有该如何求呢？

# 乘法逆元求解：
  
  由于比较主流的方法很多，加上我很菜qwq,所以就讲一下费马小定理求法.

  众所周知，费马小定理的定义是:
  $$
  \forall p\in P,a\in N,p \nmid a\Longrightarrow  a^{p-1} \equiv 1(mod\ p) 
  $$
  
  可是，这根**乘法逆元**有什么关系呢？

  $a^{p - 1}$ 是不是可以写成 $a \cdot a^{p-2}$? 

  由于乘法逆元的形式是写成 $a \cdot b$ 的形式，所以我们是不是可以认为 $a$ 是 $a$,$b$ 是 $a^{p - 2}$?

  至此，**乘法逆元**就求出来了。

  >注意！费马小定理中要求 p 为质数，所以如果 p 不为质数的话，就得要用**扩展欧几里德算法**了.

  那么，如果 $p$ 很大的话，又该如何求 $a^{p - 2}$ 呢？很简单，用快速幂就好。
  
  贴上代码：

```cpp
# include<bits/stdc++.h>
# define ll long long //宏定义，省打 long long 的时间
using namespace std;
ll a,p;//默认当前p是质数
ll pow_c(ll a,ll b,ll p){
    ll res = 1;
    while(b){
        if(b & 1) res = (res * a) % p;//利用同余定理，防止计算炸
        a = (a * a) % p;
        b >>= 1;//相当于 b / 2，效率更快 
    }
    return res;
}
int main(){
    cin >> a  >> p;
    cout<<a * pow_c(a,p - 2,p);
    return 0;
}
```

谢谢观看！
