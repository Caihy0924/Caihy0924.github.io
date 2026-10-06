---
title: "SP703 SERVICE - Mobile Service"
published: 2026-06-27
description: ""
image: "/covers/SP703-SERVICE---Mobile-Service.jpg"
tags: ["题目"]
category: "题解"
draft: false
lang: ""
pinned: false
---
总结：基础方程好想，但是进阶还要对连续性有一定的了解.

# 题面：
在一条横线上，有 $L$ 个位置 $(1,2,...,L)$ .从位置 $i$ 到 $j$ 的成本为 $c(i,j)$ .
>注：这并不是正常无向有权图，两边来往的费用不一定相同。

现在有三个员工分别在位置1，2，3.现在有 $n$ 个请求，每一次要一名员工移动到 $x_i$ ，一个位置不能有多名员工.
>也就是说，你可以一个员工在一个位置重复执行请求，这样成本都是0.

现在，问你最少的费用是多少？注：有多组测试.

数据范围：满足 $1\le L \le 200,1 \le n \le 1000,1 \le c(i,j) \le 1000$.

# 解法：

对于这道题较小的 $L$ 和 $n$ ，我们可以想到以员工所处的位置作为状态.
>定义 $f[t][i][j][k]$ 为已经完成前 $t$ 个请求，三个员工位置分别在 $i,j,k$ 的最小花费.

每一次新的请求，我们就三选一，之前的费用在叠加上位置移动所需的费用，方程如下：
$$
f[t+1][i][j][x[i]] = min(f[t+1][i][j][x[i]],f[t][i][j][k]+c[k][x[i]]
$$
$$
f[t+1][i][x[i]][k] = min(f[t+1][i][x[i]][k],f[t][i][j][k]+c[j][x[i]]
$$
$$
f[t+1][x[i]][y][k] = min(f[t+1][x[i]][y][k],f[t][i][j][k]+c[i][x[i]]
$$

不过呢，因为三个200相乘太大了，所以我们需要优化，在三个请求以后，最优情况下，每一个员工应该都在之前请求中出现的位置上.
因此，其中一个维度可以简化为上一个请求的位置，因为这个值已知，所以我们可以推出来，由于维度少了一个，枚举的循环自然也少了一层，方程如下：
$$
dp[t + 1][i][j] = min(dp[t + 1][i][j],dp[t][i][j] + c[x[t]][x[t + 1]])
$$
$$
dp[t + 1][i][x[t]] = min(dp[t + 1][i][x[t]],dp[t][i][x[t]] + c[y][x[t+1])
$$
$$
dp[t + 1][x[t]][j] = min(dp[t + 1][x[t]][j],dp[t][x[t]][j] + c[i][x[t+1])
$$

代码：
```cpp
# include<bits/stdc++.h>
using namespace std;
int t,l,n,c[205][205],a[505],dp[1005][205][205];  
signed main(){
    cin >> t;
    while(t--){
        cin >> l >> n;
        for(int i = 1;i <= l;i++){
            for(int j = 1;j <= l;j++)
                cin >> c[i][j];
        }
        memset(dp,0x3f,sizeof(dp));
        dp[0][1][2] = 0;a[0] = 3;
        for(int i = 1;i <= n;i++)
            cin >> a[i];
        for(int i = 0;i < n;i++){
            for(int x = 1;x <= n;x++){
                for(int y = 1;y <= n;y++){
                    if(x == a[i] || x == y || y == a[i]) continue;
                    dp[i + 1][x][y] = min(dp[i + 1][x][y],dp[i][x][y] + c[a[i]][a[i + 1]]);
                    dp[i + 1][x][a[i]] = min(dp[i + 1][x][a[i]],dp[i][x][y] + c[y][a[i + 1]]);
                    dp[i + 1][a[i]][y] = min(dp[i + 1][a[i]][y],dp[i][x][y] + c[x][a[i + 1]]);
                }
            }
        }
        int ans = 1e9;
        for(int x = 1;x <= n;x++){
            for(int y = 1;y <= n;y++)
                ans = min(ans,dp[n][x][y]);
        }
        cout<<ans;
    }
    return 0;
}
```
