---
title: "ABC413 A-E"
published: 2025-07-09
description: ""
image: "/covers/ABC413-A-E.jpg"
tags: ["题目"]
category: "题解"
draft: false
lang: ""
pinned: false
---
主播还是太菜了，赛时才只写出来三题QAQ.

# A-Content Too Large：

可以边输入边判断，当重量超过m时就打上一个标记。
最后根据标记判断输出yes还是no。

<details>
<summary>点击查看代码</summary>

```cpp
# include<bits/stdc++.h>
using namespace std;
int n,a,m,cnt;
int main(){
    cin >> n >> m;
    for(int i = 1;i <= n;i++){
        cin >> a;
        cnt += a;
        if(cnt > m){
            cout<<"No";
            return 0;
        }
    }
    cout<<"Yes";
    return 0;
}
```
</details>

# B-cat 2:

因为n很小，所以可以枚举所有组合情况。用一个set记录每一种情况。
如果之前不存在，就加入set并统计.

<details>
<summary>点击查看代码</summary>

```cpp
# include<bits/stdc++.h>
using namespace std;
int n,cnt;
string s[105];
set<string> q;
int main(){
    cin >> n;
    for(int i = 1;i <= n;i++)
        cin >> s[i];
    for(int i = 1;i <= n;i++){
        for(int j = 1;j <= n;j++){
            if(i == j) continue;
            string tmp = s[i] + s[j];
            if(q.find(tmp) == q.end()){
                q.insert(tmp);
                cnt++;
            }
            tmp = s[j] + s[i];
            if(q.find(tmp) == q.end()){
                q.insert(tmp);
                cnt++;
            }
        }
    }
    cout<<cnt;
    return 0;
}
```
</details>

# C-Large Queue:

将每一次的插入操作记录数量和数字并放入队列。
在操作二时可以在队首不断删除各个元素做到操作目的。

<details>
<summary>点击查看代码</summary>

```cpp
# include <bits/stdc++.h>
# define ll long long
using namespace std;
int Q,opt;
ll c,x,k;
queue<pair<ll, ll>> q;
int main() {
    cin >> Q;
    while (Q--) {
        cin >> opt;
        if (opt == 1) {
            cin >> c >> x;
            q.push({c, x}); 
        } else {
            cin >> k;
            ll ans = 0;
            while (!q.empty() && q.front().first <= k) {
                ans += q.front().first * q.front().second;
                k -= q.front().first;
                q.pop();
            }
            if (k != 0) {
                q.front().first -= k;
                ans += k * q.front().second;
            }
            cout << ans << '\n';
        }
    }
}
```
</details>

# D-Make Geometric Sequence：

按照绝对值排序，在判断公比的过程中可以将除法转换为乘法。（这点没想到）
同时，也要考虑特判公比为-1的情况。

<details>
<summary>点击查看代码</summary>

```cpp
# include<bits/stdc++.h>
using namespace std;
int n,t,a[200005];
bool cmp(int x,int y){
    return llabs(x) < llabs(y);
}
void solve(){
    cin >> n;
	for(int i = 1;i <= n;i++)
        cin>>a[i];
	sort(a + 1,a + n + 1,cmp);
	int flag = 1,flag1 = 1,flag2 = 0;
	for(int i = 2;i < n;i++){
		if(a[i] * a[i] != a[i - 1] * a[i + 1]){
			flag = 0;
			break;
		}
	}
	for(int i = 1;i <= n;i++){
		if(llabs(a[i]) != llabs(a[1])){
			flag1 = 0;
			break;
		}
	}
	if(flag1){
		for(int i = 1;i <= n;i++){
			if(llabs(a[i]) == llabs(a[1]) && a[i] != a[1]){
				flag2 = 1;
				break;
			}
		}
		if(flag2){
			int cnt0 = 0,cnt1 = 0;
			for(int i = 1;i <= n;i++){
				if(a[i] < 0) cnt0++;
				else if(a[i] > 0) cnt1++;
			}
			if(n % 2){
				if(cnt0 == cnt1 + 1 || cnt0 + 1 == cnt1) cout<<"Yes"<<endl;
				else cout<<"No"<<endl;
				return;
			}else{
				if(cnt0 == cnt1) cout<<"Yes"<<endl;
				else cout<<"No"<<endl;
				return;
			}
		}
	}
    if(flag) cout<<"Yes"<<endl;
	else cout<<"No"<<endl;
}
int main(){
    cin >> t;
    while(t--){
        solve();
    }
    return 0;
}
```
</details>

# E-Reverse 2^i ：

类似于归并排序，将序列分割成多个小块，采用贪心的思想，求当前区间最优解。

<details>
<summary>点击查看代码</summary>

```cpp
# include<bits/stdc++.h>
using namespace std;
int t,n,maxn,a[300005];
void dfs(int l,int r){
    if(r - l <= 1) return;
    int mid = (l + r) >> 1;
    dfs(l,mid);dfs(mid,r);
    if(a[l] > a[mid]){
        for(int i = 0;i < mid - l;i++)
            swap(a[l + i],a[mid + i]);
    }
    return;
}
int main(){
    cin >> t;
    while(t--){
        cin >> n;
        maxn = (1 << n);
        for(int i = 0;i < maxn;i++) cin >> a[i];
        dfs(0,maxn);
        for(int i = 0;i < maxn;i++) cout<<a[i]<<" ";
        cout<<'\n';
    }
    return 0;
}
```
</details>
