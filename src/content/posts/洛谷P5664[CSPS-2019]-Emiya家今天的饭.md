---
title: "洛谷P5664[CSPS-2019]-Emiya家今天的饭"
published: 2025-07-22
description: ""
image: "/covers/洛谷P5664-CSPS-2019--Emiya家今天的饭.jpg"
tags: ["题目"]
category: "题解"
draft: false
lang: ""
pinned: false
---
一道容斥+dp的题目，方程本身不难想，重要是怎么优化减少维度。

# 题目大意：

对于每一道菜都恰好由**一种烹饪方法**和**一种食材**构成。对于使用第 $i$ 种烹饪方法和
第 $j$ 种食材制成的菜，Emiya能做 $a_{i,j}$ 道。现在Emiya要做 $k$ 道菜，需要满足以下要求：

*  $k \ge 1$

* 每道菜的烹饪方法**互不相同**。

* 每一种在 $k$ 道菜中出现的食材在所有菜中出现的数量最多不超过一半 $(\left \lfloor \frac{k}{2} \right \rfloor)$ .

现在要求输出总共的方案数并对 $998244353$ 取模。

## 数据范围：


| 测试点编号 | $n=$ | $m=$ | $a_{i,j}<$ | 测试点编号 | $n=$ |$m=$  |$a_{i,j}<$ |
| :----------: | :----------: | :----------: | :----------: | :----------: | :----------: | :----------: | :----------: |
| $1$ | $2$ | $2$ | $2$ | $7$ | $10$ | $2$ | $10^3$ |
| $2$ | $2$ | $3$ | $2$ | $8$ | $10$| $3$ | $10^3$ |
| $3$ | $5$ | $2$ | $2$ | $9\sim 12$ | $40$ | $2$ | $10^3$ |
| $4$ | $5$ | $3$ | $2$ | $13\sim 16$ | $40$ | $3$  | $10^3$ |
| $5$ | $10$ | $2$ | $2$ | $17\sim 21$ | $40$ | $500$ | $10^3$ |
| $6$ | $10$ | $3$ | $2$ | $22\sim 25$ | $100$ | $2\times 10^3$ | $998244353$ |

对于所有测试点，保证 $1 \leq n \leq 100$，$1 \leq m \leq 2000$，$0 \leq a_{i,j} \lt 998,244,353$。

# 32分做法(1~8):

采用最朴素的方法，爆搜去枚举每一种情况。
对于某一种烹饪方法，去寻找所有可以选择的食材，也可以选择不选。
建立一个数组统计每一个食材在当前 $k$ 道菜中占据了多少道，最后如果 $n$ 种烹饪方式都选完了,
在进行判断是否符合要求，假设第 $i$ 种烹饪方法选的食材能做 $s_i$ 道菜那么最后如果符合条件则总共有 $\prod_{i=1}^{n} s_i $

**代码**：
```cpp
# include<iostream>
# include<cmath>
# define int long long
using namespace std;
const int mod = 998244353;
int n,m,ans,d[2005],a[105][2005];
void dfs(int level,int dish,int cnt){
    if(level > n){
        if(dish == 0) return;
        bool flag = true;
        for(int i = 1;i <= m;i++){
            if(d[i] > dish / 2){
                flag = false;
                break; 
            } 
        }
        if(flag) ans = (ans + cnt) % mod;
    }else{
        dfs(level + 1,dish,cnt);
        for(int i = 1;i <= m;i++){
            if(a[level][i] == 0) continue;
            d[i]++;
            dfs(level + 1,dish + 1,(cnt * a[level][i]) % mod);
            d[i]--;
        }
    }
    return;
}
signed main(){
    cin >> n >> m;
    for(int i = 1;i <= n;i++){
        for(int j = 1;j <= m;j++)
            cin >> a[i][j];
    }
    dfs(1,0,1);
    cout<<ans;
    return 0;
}
```

因为每次选择 $n$ 种食材中还有不选的情况，所以时间复杂度为 $O((m+1)^n)$.

# 64分做法(1~16)

我们采用数学的方法计算，假设不考虑第三种情况，那么设 $sum_i = \sum^{m}_{j = 1} a[i][j]$,那么总共的方案数为：
$$
\prod_{i = 1}^{n} (sum_i + 1) - 1
$$

括号内部加一是因为要考虑不选这个烹饪方式的情况，而最后减一则是减去全都不选的情况。
这是不是有点像容斥原理？现在考虑第三种要求，我们同理，通过计算出不符合的状态，进而算出合法的方案数。

设 $dp[i][j][k]$ 为前 $i$ 种烹饪方式，选了 $j$ 道菜，其中 $k$ 道是枚举不合法的食材，
而这个不合法的食材，需要开一个循环 $m$ 个食材都枚举一遍，那么针对 $k$ 值的不同，则区分了合法和不合法的方案数：

* 对于所有的 $dp[i][j][k]$ ,如果不选，则 $dp[i][j][k]=dp[i-1][j][k]$ .

* 如果 $k >0$ ，设枚举的不合法食材为 $s$ ,则 $dp[i][j][k] = a_{i,s} * dp[i][j - 1][k - 1]$ .

* 对于所有的情况，考虑合法的方案数为 $dp[i][j][k] = (sum_i - a_{i,s}) * dp[i][j - 1][k]$. 

那么对于最后所有的不合法方案，总共为：
$$
\sum_{k \ge \left \lfloor\frac{j}{2}\right \rfloor}^{}  dp[n][j][k]
$$

**代码**：
```cpp
# include<iostream>
# include<cstring>
# include<cmath>
# define int long long
using namespace std;
const int mod = 998244353;
int n,m,tmp,ans = 1,dp[50][505][505],a[105][2005],sum[105];
signed main(){
    cin >> n >> m;
    for(int i = 1;i <= n;i++){
        for(int j = 1;j <= m;j++){
            cin >> a[i][j];
            sum[i] = (sum[i] + a[i][j]) % mod;
        }
        ans = ans * (sum[i] + 1) % mod;
    }
    ans = (ans - 1 + mod) % mod;
    for(int l = 1;l <= m;l++){ //枚举不合法食材
        memset(dp,0,sizeof(dp));
        dp[0][0][0] = 1;
        for(int i = 1;i <= n;i++){
            dp[i][0][0] = 1;
            for(int j = 1;j <= i;j++){
                for(int k = 0;k <= j;k++){
                    dp[i][j][k] = dp[i - 1][j][k];
                    if(k > 0) dp[i][j][k] = (dp[i][j][k] + (dp[i - 1][j - 1][k - 1] * a[i][l]) % mod) % mod;
                    dp[i][j][k] = (dp[i][j][k] + dp[i - 1][j - 1][k] * (sum[i] - a[i][l]) % mod) % mod;
					if (i == n && k >= j / 2 + 1) tmp = (tmp + dp[i][j][k]) % mod;
                }
            }
        }
    }
    ans = (ans - tmp + mod) % mod;
    cout<<ans;
    return 0;
}
```

由于是三重 $n$ 的循环加上一个 $m$ 的循环，所以复杂度为 $O(n^3m)$.

# 100分做法：

限制三如果用数学符号表示则为任意食材x满足 $x \le \left \lfloor \frac{k}{2} \right \rfloor $ ,学过不等式的，可以对其化简，于是：
$$
x \le \left \lfloor \frac{k}{2} \right \rfloor  
$$
$$
2x \le k 
$$
$$
2x-k \le 0
$$
$$
x - (k-x) \le 0
$$
化简发现，不需要在意具体食材的使用数量，只要关心合法食材数量与不合法的差值即可。针对差值，可以对此进行dp。
但是因为会有负数的情况，所以要加一个偏移量 $n$ 。由于只要关注差值，所以省去了一个维度。方程如下：

* 如果不选则 $dp[i][j] = dp[i - 1][j]$ .

* 选择了合法的食材，则 $dp[i][j] = (sum_i - a_{i,s}) * dp[i][j + 1]

* 选择了不合法的食材，则 $dp[i][j] = a_{i,s} * dp[i][j - 1]$.

**代码：**
```cpp
# include<iostream>
# include<cstring>
# include<cmath>
# define int long long
using namespace std;
const int mod = 998244353;
int n,m,tmp,ans = 1,dp[105][2005],a[105][2005],sum[105];
signed main(){
    cin >> n >> m;
    for(int i = 1;i <= n;i++){
        for(int j = 1;j <= m;j++){
            cin >> a[i][j];
            sum[i] = (sum[i] + a[i][j]) % mod;
        }
        ans = ans * (sum[i] + 1) % mod;
    }
    ans = (ans - 1 + mod) % mod;
    for(int l = 1;l <= m;l++){
        memset(dp,0,sizeof(dp));
        dp[0][n] = 1;
        for(int i = 1;i <= n;i++){
            for(int j = -i + n;j <= i + n;j++){
                dp[i][j] = (dp[i - 1][j] + dp[i - 1][j - 1] * a[i][l] % mod + dp[i - 1][j + 1] * (sum[i] - a[i][l]) % mod) % mod;
				if (i == n && j > n) tmp = (tmp + dp[i][j]) % mod;
            }
        }
    }
    ans = (ans - tmp + mod) % mod;
    cout<<ans;
    return 0;
}
```

感谢观看！
