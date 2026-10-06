---
title: "Codeforces round 1043 Div 3 A-C"
published: 2025-08-26
description: ""
image: "/covers/Codeforces-round-1043-Div-3-A-C.jpg"
tags: ["题目"]
category: "题解"
draft: false
lang: ""
pinned: false
---
# A-Homework:

分别建立两个字符串维护两个人的操作，弗拉德的操作得到的字符串 $b$ 经过反转与迪马的字符串 $a$ 
结合就得到了最终的结果。

# B-The Secret Number：

假设在 $x$ 的后面加入了 $k$ 个零，那么 $n = x + y = x \cdot (10^k + 1)$ 由于 $n$ 最多不超过long long上限，
所以枚举能够整除 $n$ 的 $(10^k + 1)$ ，最后进行排序即可.

# C-The Cunning Seller(Easy/Hard)

# 题目大意：

现在对于一个整数 $x$ ，可以花 $3^{x + 1} + x\cdot 3^{x - 1}$ 的价格买下 $3^x$ 个西瓜。
现在你需要买 $n$ 个西瓜，输出在交易次数尽可能小的情况下，所需的最小金币。

>困难版的条件则是给出 $k$ 次交易的限制，给出在限制下的最少花费，无法达到则输出-1。

# 解法(easy)：

在解决问题时，我们要知道几个事实：

* 购买两个以上的 $3^x$ 是没意义的，因为等同于 $3^{x + 1}$ 且可以节省次数。

* 购买 $3^{\left \lfloor log_3\ n \right \rfloor }$ 以上的西瓜是没有意义的。
> 如果你购买了超出限制的西瓜，这是无意义的。

因此，对于可以选的所有单次购买数量，我们从0至2次中挑选并分配，即满足：

$$
\sum_{k = 0}^{\lfloor \log_3 n \rfloor} 3^k \cdot w_k = n
$$
可以得出，这个是 $n$ 的三进制表达形式，由于具有唯一性，所以只需求出对应的 $w_k$ 即可算出成本为：
$$
\sum_{k=0}^{\lfloor \log_3 n \rfloor} (3^{k+1} + k \cdot 3^{k-1}) \cdot w_k
$$

<details>
<summary>点击查看代码</summary>

```cpp
# include <bits/stdc++.h>
using namespace std;
int t;
long long c = 3,cnt = 1;
long long cost[24];
int main() {
    for (int i = 0; i < 21; ++i) {
        cost[i] = c;
        c = 3 * c + cnt;
        cnt *= 3;
    }
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        long long min_k = 0;
        long long min_cost = 0;
        int sz = 0;
        while (n) {
            min_k += n % 3;
            min_cost += (n % 3) * cost[sz];
            n /= 3;
            sz++;
        }
        cout << min_cost << '\n';
    }
    return 0;
}

```
</details>

# 解法(困难):

显然，购买 $3 * 3^x$ 比 $3^{x + 1}$ 所需的成本更少，且随着 $x$ 的增长，购买 $3^{x + 1}$ 所损失的钱越多。这点可以证明确定:

假设 $a$ 是购买 $3^{x + 1}$ 所需的钱，则结果为 $3^{x + 2} + (x + 1)\cdot 3^x$ ,再假设 $b$ 为购买 $3\cdot 3^x$ 所需的费用，
则结果为 $3 \cdot (3^{x+1}+x \cdot 3^{x-1})$ 。我们得到 $a - b$ , 得到 $3^x$ 。显然， $3^x &gt; 0$ 。而且随着 $x$ 的增加，差异也会增加。

现在我们分两步来解决这个问题：

1. 我们将找到购买 $n$ 西瓜所需的最小交易数。该问题在简单版本已经解决，如果它大于 $k$ , 我们将输出 $-1$ 。
2. 根据上述提到的结论。我们将选择最大的交易，并尽可能将其分解为 3 个较小的交易。

<details>
<summary>点击查看代码</summary>

```cpp
# include <bits/stdc++.h>
using namespace std;
long long n,k,t;
long long c = 3,cnt = 1,cost[24];
int main() {
    for (int i = 0; i < 21; ++i) {
        cost[i] = c;
        c = 3 * c + cnt;
        cnt *= 3;
    }
    cin >> t;
    while (t--) {
        cin >> n >> k;
        vector <long long> tr;
        long long min_k = 0;
        while (n) {
            tr.push_back(n % 3);
            min_k += n % 3;
            n /= 3;
        }
        if (min_k > k) {
            cout << -1 << '\n';
            continue;
        }
        k -= min_k;
        k /= 2;
        for (int i = (int)tr.size() - 1; i >= 1; --i) {
            if (tr[i] <= k) {
                tr[i - 1] += 3 * tr[i];
                k -= tr[i];
                tr[i] = 0;
            } else {
                tr[i - 1] += k * 3;
                tr[i] -= k;
                break;
            }
        }
        long long ans = 0;
        for (int i = (int)tr.size() - 1; i >= 0; --i)
            ans += cost[i] * tr[i];
        cout << ans << '\n';
    }
    return 0;
}
```
</details>
