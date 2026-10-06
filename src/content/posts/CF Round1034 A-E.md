---
title: "CF Round1034 A-E"
published: 2025-07-15
description: ""
image: "/covers/CF-Round1034-A-E.jpg"
tags: ["题目"]
category: "题解"
draft: false
lang: ""
pinned: false
---
第二次打div.3，还是太菜了QAQ：

# A-Blackboard Game:

数学题，由于Bob每次要找与Alice相加能模4为3的数。
所以我们在输入时统计模四不同的结果的数量。

模4为3的组合有 ${0,3}\ {1,2}$ ，所以我们只需要统计这两个组合中的两个数是否相等，
如果相等，则Bob获胜（因为能刚好凑完），否则就是Alice获胜。

<details>
<summary>点击查看代码</summary>

```cpp
# include <bits/stdc++.h>
using namespace std;
int t,n;
int main(){
    cin >> t;
    while(t--){
        cin >> n;
        int cnt[5] = {};
        for(int i = 0; i < n; i++)
            cnt[i % 4]++;
        cout<<(cnt[0] == cnt[3] && cnt[1] == cnt[2] ? "Bob" : "Alice")<<'\n';
    }
    return 0;
}
```
</details>

# B-Tournament:

贪心，考虑对旗手 $j$ 最有利的情况，比自己实力高的混战，最后最大的留下来。
自己则把比自己菜的解决掉，最后剩下自己和最厉害的，如果还不小于等于 $k$ 则给出no。

要考虑自己是最厉害的情况，直接输出yes。

<details>
<summary>点击查看代码</summary>

```cpp
# include <bits/stdc++.h>
using namespace std;
int t,n,j,k,a[200005];
int main(){
    cin >> t;
    while(t--){
        cin >> n >> j >> k;
        int dj = 0,tmp = 0,tmp2 = 0;
        for(int i = 1;i <= n;i++)
            cin >> a[i];
        j = a[j];
        sort(a + 1,a + n + 1);
        for(int i = n;i > 0;i--){
            if(a[i] == j){
                tmp = i;
                break;
            }
        }
        tmp2 = n - tmp;
        if(tmp == n){cout<<"YES"<<'\n'; //特判
        }else if(n - tmp2 + 1 <= k){cout<<"YES"<<'\n';
        }else{
            if(n - tmp2 - tmp + 2 <= k) cout<<"YES"<<'\n';
            else cout<<"NO"<<'\n';
        }
    }
    return 0;
}
```
</details>

# C-Prefix Min and Suffix Max：

由于题中的两项操作都与最值有关系，我们不妨考虑一下 $a_i$ 为不同值的情况：

>当 $a_i$ 为 $a$ 中的**后缀最大值**或**前缀最小值**时，由于两种操作
>都可以选择整个数组，所以是成立的。当为最大值时，可以挑选为整个数组的后缀。
>而当为最小值时，则挑选整个数组作为前缀.

>当 $a_i$ 不是 $a$ 中的**后缀最大值**或**前缀最小值**时，定义 $a_p$ 为 $\{a_1,a_2,...,a_i\}$的最小值，
>$a_s$ 为 $\{a_i,a_{i + 1},...,a_n\}$ 的最大值，定义满足 $p < i < s,a_p < a_i < a_s$ .
>
>在保证不删除 $a_i$ 的情况下，我们无法删除 $a_p$ 和 $a_s$ .理由如下：
>
>>如果想要通过选取一段包含小于 $a_p$ 的元素的前缀用来删除 $a_p$ ，那么 $a_i$ 就会被删除。
>>应为根据定义， $a_p$ 为 $\{a_1,a_2,...,a_i\}$的最小值，这意味着需要往 $a_i$ 右边去寻找更小的元素，
>>但 $a_i$ 并不是前缀最小值，所以会被一起删除。同理，如果想要找到一串后缀用来删除 $a_s$ ,则需要到 $a_i$ 左边寻找元素，
>>但 $a_i$ 并不是后缀最大值，所以也会被一起删除.
>
> 综上所述，$a_i$ 不可能在操作中被保留下来.

<details>
<summary>点击查看代码</summary>

```cpp
# include<bits/stdc++.h>
using namespace std;
const int inf = 1e9 + 7;
int t,n;
void solve(){
    cin >> n;
    vector<int> a(n + 2),minn(n + 2,inf),maxn(n + 2); //使用vector动态分配空间
    for(int i = 1;i <= n;i++)
        cin >> a[i];
    for(int i = 1;i <= n;i++) minn[i] = min(minn[i - 1],a[i]);
    for(int i = n;i >= 1;i++) maxn[i] = max(maxn[i + 1],a[i]);
    for(int i = 1;i <= n;i++)
        cout<<(minn[i] == a[i] || maxn[i] == a[i] ? 1 : 0);
}
int main(){
    cin >> t;
    while(t--){
        solve();
        cout<<'\n';
    }
    return 0;
}
```
</details>

# D-Binary String Battle:

结论题，设cnt为串中1的数量，如果满足 $cnt \le k$ 或 $n < 2k$ ,则Alice赢，否则Bob赢.

<details>
<summary>点击查看代码</summary>

```cpp
# include <bits/stdc++.h>
using namespace std;
int n,k;
void solve(){
    cin >> n >> k >> s;
    int cnt = 0;
    for(char c : s)
        if(c == '1')
            cnt++;
    cout << (cnt <= k || n < 2 * k ? "Alice" : "Bob") << '\n';
}
 
int main(){
    int t;
    cin >> t;
    while(t--) solve();
}
```
</details>

# E-MEX Count:

既然直接求复杂度太大，不妨往相反的方向想。
思考当 $MEX$ 为 $0,1,...,n$ 的情况要删多少个数，分别计算出来在进行统计。

在计算过程中假设当前要使 $MEX$ 变为 $x$ ，那么删除数字的数量组成的集合是**连续**的。

对于一个数，想要使其变为 $MEX$ ，至少要把自己在数组出现的所有地方都删除掉，
$0~x-1$ 只剩一个的数字是**不可删的**，而剩余的数字是**可删可不删**的。

我们能决定删除数量的只有**可删可不删**这一类，而其数量是固定的，无论是删几个都符合题目的条件。

那么现在总共删除的数字中必须删除的为固定值，可删可不删的数量是连续的，那么总共删除的数量就是连续的。

现在问题就变为了多个区间相加的问题,可以用双指针解决.

区间左端点为**必删的数量**，右端是必删加上**所有可删可不删的数量（方便统计），即 $n - \text{不可删的数量}\left (MEX\right )$

必删的数量可以提前预处理知道， $MEX$ 也是可以枚举的，所以也能知道，这样左右端点都能求到，就没有什么问题了。

<details>
<summary>点击查看代码</summary>

```cpp
# include <bits/stdc++.h>
using namespace std;
int n;
void solve(){
    cin >> n;
    vector<int> a(n), ans(n+1), diff(n+2);
    map<int, int> freq;
    for(int i = 0; i < n; i++){
        cin >> a[i];
        freq[a[i]]++;
    }
    for(int i = 0; i <= n; i++){
        diff[freq[i]]++;
        diff[n - i + 1]--;
        if(!freq[i])
            break;
    }
    for(int k = 0; k <= n; k++){
        ans[k] = (k ? ans[k - 1] : 0) + diff[k];
        cout << ans[k] << (k != n ? ' ' : '\n');
    }
}
int main(){
    int t;
    cin >> t;
    while(t--){
      solve();
    }
    return 0;
}
```
</details>
