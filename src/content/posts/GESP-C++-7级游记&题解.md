---
title: "GESP-C++-7级游记&题解"
published: 2025-06-28
description: ""
image: "/covers/GESP-C++-7级游记-题解.jpg"
tags: ["题目"]
category: "游记"
draft: false
lang: ""
pinned: false
---
这次七级真的是十分惊险，第二道题最后几分钟才写出来QAQ.

# 比赛经历：

## *10:30 a.m:*
 
准备出发前往考点，临走前还在看上上次的编程真题。

## *12:00~12:40:*

觅食与吃午饭，中午饭感觉没胃口。

## *13:00* 进入考场

## *13:39* 成功写出第一道题

## *14:07* 选择+判断完成

## *16:26* 第二题终于调完，AC.

# 题目讲解:

## 第一题：

给定一个 $n$ 个节点， $m$ 条边的无向图 $G$ 。如果两条无向边($u_1,v_1\ u_2,v_2$)其中出现重复的节点，
那么将两条边转化为两个点并建立一条无向边连接存储在图 $L$ .求最后图 $L$ 中有多少条无向边？

*提示：无向图 $G$ 无自环与重边。*

*省流:表面是图论，实则啥也不是.

建立一个数组 $d$ 表示每个节点有多少条边与其连接。输入过程中每加入一条边，
就统计两个点的 $d[i]$ ,然后再各自加一，可以理解为和之前所有的边都建立一条
无向边。不用担心先加进的统计的少，后面加入的 $d[i]$ 已经包含了每一条边的情况。

由于可以在输入时完成所以时间为 $O\left ( M \right ) $.而空间则是数组 $d$ 的大小为 $O\left ( N \right ) $.

代码：
```cpp
# include<bits/stdc++.h>
using namespace std;
int n,m,cnt,d[100005];
int main(){
    cin >> n >> m;
    while(m--){
        int u,v;
        cin >> u >> v;
        cnt += d[u];cnt += d[v];
        d[u]++;d[v]++;
    }
    cout<<cnt;
    return 0;
}
```

## 第二题：

小明想要在 $n$ 个食材中挑选一些用来做菜（也可以不选）。
每个食材都有一个甜度值 $A_i$ 和酸度值 $B_i$ 。对于一道菜，
甜度 $A$ 为各个食材甜度值之和，酸度 $B$ 为酸度值之和。
如果一道菜甜度与酸度相等，那么我们称其是*平衡的*。

小明想知道，在保证菜品平衡的情况下，甜度与酸度之和最大是多少？

> 对于 $20\%$ 的数据，保证 $1 \le n \le 10,1 \le a_i,b_i \le 10$.
>
> 对于另外 $20\%$的数据，保证 $1 \le n \le 50,1 \le a_i,b_i \le 10$.
>
> 对于 $100\%$ 的数据，保证 $1 \le n \le 100,1 \le a_i,b_i \le 500$.

### 20分做法：

观察数据，发现在n不超过10的时候，可以通过dfs枚举每个食材的选取情况。
由于每个食材有选或不选，所以总体的复杂度为 $2^n$ .不会炸掉。

代码：
```cpp
# include<bits/stdc++.h>
using namespace std;
int n,a[105],b[105],cnt;
void dfs(int x,int cnta,int cntb){
    if(cnta == cntb) cnt = max(cnt,cnta + cntb); //因为后面可能还能凑出更大的
    if(x > n) return; //超过了就返回
    dfs(x + 1,cnta + a[x],cntb + b[x]); //选
    dfs(x + 1,cnta,cntb); //不选
    return;
}
int main(){
    cin >> n;
    for(int i = 1;i <= n;i++)
        cin >> a[i] >> b[i];
    dfs(1,0,0);
    cout<<cnt<<'\n';
    return 0;
}
```

### 40分做法：

我们可以去枚举前 $i$ 个食材的甜度和酸度，设 $dp[i][j][k]$ 为前 $i$ 个食材,甜度 $j$ 与酸度 $k$ 之间的差。

* 如果 甜 > 酸 那么 $j$ 为 甜-酸 , $k$ 为0。
* 如果 甜 < 酸,则 $j$ 为0, $k$ 为 酸-甜

在枚举的过程中，我们通过推回之前的状态进一步得出现在的结果。虽然可能会有很多浪费空间，但最终可以求出来。

由于甜度和酸度最大就只有500,所以枚举差的范围在450以内. $1.25 * 10^7$ 的也是可接受的。

另外，我们可以在读入的过程中把食材两个值相同的直接加入最终答案。不必再次计算。

代码：
```cpp
# include<bits/stdc++.h>
# define first (tmp > tmp2 ? tmp - tmp2 : 0)
# define second (tmp > tmp2 ? 0 : tmp2 - tmp)
using namespace std;
int n,a[105],b[105],dp[55][460][460],cntz;
int main(){
    cin >> n;
    for(int i = 1;i <= n;i++){
        cin >> a[i] >> b[i];
        if(a[i] == b[i]){
            cntz += a[i] + b[i];
            i--;n--;
        }
    }
    dp[1][(a[1] > b[1] ? a[1] - b[1] : 0)][(a[1] > b[1] ? 0 : b[1] - a[1])] = a[1] + b[1];//初始化
    for(int i = 2;i <= n;i++){
        for(int j = 0;j <= 460;j++){
            for(int k = 0;k <= 460;k++){
                int tmp = j + 500 - a[i]; //相当于不选当前的食材
                int tmp2 = k + 500 - b[i];
                if(dp[i - 1][first][second] == 0){ //不存在就直接等于前一个食材的结果
                    dp[i][j][k] = dp[i - 1][j][k];
                    continue;
                }
                dp[i][j][k] = dp[i - 1][first][second] + a[i] + b[i];
            }
        }
    }
    cout<<cntz + dp[n][0][0];
    return 0;
}
```
但是剩下的数据，差值最大可达49900,所以这样枚举还是不行的.

### 100做法：

我们定义不均衡值 $c[i]$ 为 $a[i]-c[i]$ 这样在枚举过程中只需要双重循环。
但是，由于 $c[i]$ 的正负性，在枚举的过程中会出现下标为负数的情况，那么该如何避免呢？

一个简单的方法，将数组的下标挪一段位置，但是会有空间浪费，但对于本题足够了.

代码：
```cpp
# include<bits/stdc++.h>
using namespace std;
int n,a[105],b[105],c[105],tmp[150000],tmp2[150000],cntz;
int main(){
    cin >> n;
    for(int i = 1;i <= n;i++){
        cin >> a[i] >> b[i];
        if(a[i] == b[i]){
            cntz += a[i] + b[i];
            i--;n--;
        }else c[i] = a[i] - b[i]; // 不均衡值
    }
    tmp[c[1] + 49900] = a[1] + b[1];
    for(int i = 2;i <= n;i++){
        for(int j = -49900;j <= 49900;j++){
            if(i % 2 == 0){
                if(!tmp[j - c[i] + 49900]){
                    tmp2[j + 49900] = tmp[j + 49900];
                    continue;
                }
                tmp2[j + 49900] = tmp[j - c[i] + 49900] + a[i] + b[i];
            }else{
                if(!tmp2[j - c[i] + 49900]){
                    tmp[j + 49900] = tmp2[j + 49900];
                    continue;
                }
                tmp[j + 49900] = tmp2[j - c[i] + 49900] + a[i] + b[i];
            }
        }
    }
    if(n % 2 == 0) cout<<cntz + tmp2[49900];
    else cout<<cntz + tmp[49900];
    return 0;
}
```
感谢观看！
