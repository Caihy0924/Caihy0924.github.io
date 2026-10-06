---
title: "Atcoder abc415 A-E"
published: 2025-08-20
description: ""
image: "/covers/Atcoder-abc415-A-E.jpg"
tags: ["题目"]
category: "题解"
draft: false
lang: ""
pinned: false
---
终于写出四题了！！！

# A-AtCoder Language:

# 题目大意：
给定了 "**红**"，"**蓝**"，"**绿**" 三种颜色的编码形式，输入一个单词，输出对应的编码形式。无法查询则输出"**Unknown**"。

# 解法：
输入字符串，if else判断三种颜色是否符合，最后仍不符合输出错误.

<details>
<summary>点击查看代码</summary>

```cpp
# include<bits/stdc++.h>
# include<cstring>
using namespace std;
int main(){
    string s;
    cin >> s;
    if(s == "red") cout<<"SSS";
    else if(s == "blue") cout<<"FFF";
    else if(s == "green") cout<<"MMM";
    else cout<<"Unknown";
    return 0;
}
```
</details>

# B-Get Min:

# 题目大意：

维护一个集合，接下来有 $Q$ 次操作：

1. 在集合内插入一个元素 $x$ 。

2. 输出集合内最小的元素，并取出该元素。

> 集合内允许重复元素，且取出仅只需取出一个。

# 解法：

学了STL就是白送，可以使用多重集合(multiset),能够自动排序。
如果没学过也没关系，可以建立一个桶维护，输出时从小到大遍历，如果发现元素数量不为零则输出并且数量减一.

<details>
<summary>点击查看代码</summary>

```cpp
# include<bits/stdc++.h>
using namespace std;
int n,opt,x;
multiset<int> s;
int main(){
    cin >> n;
    while(n--){
        cin >> opt;
        if(opt == 1){
            cin >> x;
            s.insert(x);
        }else{
            if(s.empty()) continue;
            int y = *s.begin();
            cout<<y<<'\n';
            s.erase(s.begin());
        }
    }
    return 0;
}
```
</details>

# C-King's Summit:

# 题目大意：
 
在一个棋盘上放置了 $N$ 枚国王，每个国王的坐标为 $(R_i,C_i)$ .国王每次可以在八个方向中选择一个并移动一步。
现在你需要确定一个集合点，确保每个国王能够在最少的时间内到达集合点，并输出这个最小时间，同一时间内所有国王移动一步。

# 解法：

数学题，需要找到每一个节点的距离都能恰好的点，最好的办法就是找中点，我们可以构造出一个虚拟的长方形，
而长方形的长和宽则是最大和最小的 $R_i$ 以及 $C_i$ 之间的差。中点即为边上取半，对于最大到达所需时间，
由于可以走斜线，所以时间为长和宽之间的最大值，那么最少的时间现在也已经确定了.

<details>
<summary>点击查看代码</summary>

```cpp
# include<bits/stdc++.h>
# define int long long
using namespace std;
int n,maxr,minr = 1e9 + 7,maxc,minc = 1e9 + 7,r,c;
signed main(){
    cin >>n;
    while(n--){
        cin >> r >> c;
        maxr = max(maxr, r);
        minr = min(minr, r);
        maxc = max(maxc, c);
        minc = min(minc, c);
    }
    //一定要向上取整！！！
    cout<<max((maxr - minr + 1) / 2,(maxc - minc + 1) / 2)<<'\n';
    return 0;
}
```
</details>

# D-Substr Swap：

# 题目大意：

给定了长度为 $N$ 的两个字符串 $S,T$ .现要进行 $M$ 次交换的操作。
对于第 $i$ 次操作输入的二元组 $(L_i,R_i)$ 对应着字符串 $S$ 的 $S_{L_i}$ 至 $S_{R_i}$ 与字符串 $T$ 中的 $T_{L_i}$ 至 $T_{R_i}$ 进行交换.

现要求输出进行 $M$ 次操作过后的字符串 $S$ 。

# 解法：

省流：比第三题好想。

由于字符的下标是不会变化的，最终的字符需要看交换次数，因此记录每个下表交换次数的奇偶即可。
而对于连续字串的操作，可以用差分数组进行维护，最后看每一位是奇偶即可判断。

<details>
<summary>点击查看代码</summary>

```cpp
# include<bits/stdc++.h>
using namespace std;
int n,m,cnt,d[500005],l[200005],r[200005];
string s,t;
int main(){
    cin >> n >> m;
    cin >> s >> t;
    for(int i = 1;i <= m;i++){
        cin >> l[i] >> r[i];
        d[l[i] - 1]++;d[r[i]]--;
    }
    for(int i = 0;i < n;i++){
        cnt += d[i];
        if(cnt % 2 == 1) cout<<t[i];
        else cout<<s[i];
    }
    return 0;
}
```
</details>

# E-Subarray Sum Divisibility：

# 题目大意：

给定一个长度为 $N$ 的数列 $A = {A_1,A_2,...,A_n}$ .每一次操作都可以选择一个 $A_i$ 加一。
现在要求用最少的操作次数使得每一个长度为 $L$ 的连续序列元素之和都与 $M$ 同余.

# 解法：

可以使用动态规划写dp方程解决。

如果想要满足题目所要求的条件，则需要满足下面两个条件:

* $A_1 + A_2 + ... + A_L$ 的结果要为 $M$ 的倍数。

* 对于符合 $1 \le i \le N - L$ 的所有的 $i$ , 都需要符合 $A_i - A_{i + L}$ 为 $M$ 的倍数。

在知道这个条件后，我们可以进行方程的构造。定义 $dp[i][j]$ 为前 $i$ 个元素之和余 $M$ 结果为 $j$ 的最小方案数，
关于预处理，根据定理2可以预处理出所有 $A_i - A_{i + L}$ 模 $M$ 为 $j$ 的最小代价。而状态的转移则是第一层枚举元素的数量，第二层枚举余数即可。

<details>
<summary>点击查看代码</summary>

```cpp
# include<bits/stdc++.h>
using namespace std;
const int inf = 1e9 + 7;
int n,m,l,a[505];
int main(){
    cin >> n >> m >> l;
    for(int i = 0;i < n;i++)
        cin >> a[i];
    vector<int> dp(m,inf);
    dp[0] = 0;
    for (int i = 0; i < l; i++) {
		vector<int> ep(m, inf);
		for (int j = 0; j < m; j++) {
			int cost = 0;
			for (int k = i; k < n; k += l) {
				if (j >= a[k]) cost += j - a[k];
				else cost += j - a[k] + m;
			}
			for (int k = 0; k < m; k++) ep[(k + j) % m] = min(ep[(k + j) % m], dp[k] + cost);
		}
		dp.swap(ep); 
    }
	cout << dp[0] << '\n';
    return 0;
}
```
</details>
