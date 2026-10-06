---
title: "Atcoder aabc415 A-E"
published: 2025-07-26
description: ""
image: "/covers/Atcoder-aabc415-A-E.jpg"
tags: ["题目"]
category: "题解"
draft: false
lang: ""
pinned: false
---
# A-Unsupported Type：

送分的，输入完在一遍循环查找即可~~(当然也可以用二分查找)~~

- 代码：
    
    ```cpp
    #include<bits/stdc++.h>
    using namespace std;
    bool flag = false;
    int n,x,a[105];
    int main(){
    	cin >> n;
    	for(int i = 1;i <= n;i++) cin >> a[i];
    	cin >> x;
    	for(int i = 1;i <= n;i++){
    		if(a[i] == x) flag = true;
    	}
    	if(flag) cout<<"Yes";
    	else cout<<"No";
    	return 0;
    }
    ```
    

# B-Pick Two：

可以在输入时解决。在读入过程中记录当前遇见多少个货物，如果为偶数则输出。

- 代码：
    
    ```cpp
    #include<iostream>
    #include<cstring>
    using namespace std;
    int h1,h2;
    string s;
    int main(){
        cin >> s;
        for(int i = 0;i < s.size();i++){
            if(s[i] == '#'){
                if(h1) h2 = i + 1;
                else h1 = i + 1;
            }
            if(h1 && h2){
                cout<<h1<<","<<h2<<'\n';
                h1 = 0;h2 = 0;
            }
        }
        return 0;
    }
    ```
    

# C-Mixtrue:

省流：爆搜。

第一眼看到时，以为是什么数学题，最后发现可以直接用搜索解决。

考虑使用bfs(广搜),队列元素为当前已经放进去的元素的**代表值**~~(对不起我语文不好),~~如放进去了药品1和2，那么代表值为3(其实就是二进制转十进制).

最开始的队列初始元素为在混入一个药品时安全的元素，如果没有，则直接输出no。此后在队列的元素上继续扩展。如果已经混合进去则跳过，没被混合则判断混合后是否为危险的情况，不危险则加入队列，最后判断是否做到全部混合。

> 一定要每次查看队头元素后删除元素！
> 
- 代码：
    
    ```cpp
    #include<iostream>
    #include<cstring>
    #include<queue>
    #define int long long
    using namespace std;
    bool vis[300000];
    int t,n,lg[20];
    string s;
    queue<int> q;
    void solve(){
        cin >> n >> s;
        s = " " + s; //加空格方便判断是否危险
        memset(vis,0,sizeof(vis));
        while(!q.empty()) q.pop();
        for(int i = 0;i < n;i++){
            if(s[lg[i]] == '0')
                q.push(lg[i]);
        }
        while(!q.empty()){
            int tmp = q.front();
            if(tmp == lg[n] - 1){
                cout<<"Yes"<<'\n';
                return;
            }
            for(int i = 0;i < n;i++){
                if(tmp & lg[i]) continue;
                if(s[tmp + lg[i]] == '0' && vis[tmp + lg[i]] == false)
                    vis[tmp + lg[i]] = true,q.push(tmp + lg[i]);
            }
            q.pop();
        }
        cout<<"No"<<'\n';
        return;
    }
    signed main(){
        cin >> t;
        for(int i = 0,j = 1;i < 18;i++,j *= 2)
            lg[i] = j;
        while(t--){
            solve();
        }
        return 0;
    }
    ```
    

# D-**Get Many Stickers**

看到的第一眼，可能想到贪心，但不是空瓶或换瓶子的贪心，而是贪之间的差值，如果差值过大，那么换了无法拥有更多的可乐继续换贴纸，

如果差值相等，那么优先选择空瓶代价小的。

> 一定要开long long！
> 
- 代码：
    
    ```cpp
    #include<iostream>
    #include<algorithm>
    #define int long long
    using namespace std;
    struct cola{
        int x,y,a;
    }plan[200005];
    int n,m,cnt;
    bool tmp(cola i,cola j){
        if(i.a != j.a) return i.a < j.a;
        else i.x < j.x; //差值相同特判
    }
    signed main(){
        cin >> n >> m;
        for(int i = 1;i <= m;i++){
            cin >> plan[i].x >> plan[i].y;
            plan[i].a = plan[i].x - plan[i].y;
        }
        sort(plan + 1,plan + m + 1,tmp);
        for(int i = 1;i <= m;i++){
            if(plan[i].x > n) continue;
            int tmp = (n - plan[i].x + plan[i].a) / plan[i].a;
            cnt += tmp,n -= tmp * plan[i].a;
        }
        cout<<cnt;
        return 0;
    }
    ```
    

# E-Max Combo

关于高桥是否能活下来，可以采用 $dp$ 的方法，而求出最小初始金额，则可以使用二分解决。

设 $dp_{i,j}$ 为走到第 $i$ 行第 $j$ 列的格子时剩余的最大金钱。如果无法到达(没钱吃饭),则设为 $-inf$ ,格子无法到达即意味着无法更新。角色的转移很好求，从之前的状态转移过来。方程为：

$$
dp_{i,j} = max(dp_{i - 1,j},dp_{i,j-1}) + a_{i,j}
$$

最开始除了起点其他都赋值为 $-inf$ ，最后判断终点 $(h,w)$ 是否更新即可。

- 代码：
    
    ```cpp
    #include<iostream>
    #include<vector>
    #define int long long
    #define vi vector<int>
    using namespace std;
    int h,w,p[200005];
    const int inf = 1e18;
    signed main(){
        ios::sync_with_stdio(false);
        cin.tie(0);cout.tie(0);
        cin >> h >> w;
        vector<vi> a(h + 1,vi(w + 1));
        for(int i = 1;i <= h;i++){
            for(int j = 1;j <= w;j++)
                cin >> a[i][j];
        }
        for(int i = 1;i <= h + w - 1;i++)
            cin >> p[i];
        int l = 0,r = 1e18,cnt = 1e18;
        while(l <= r){
            int mid = (l + r) / 2;
            vector<vi> dp(h + 1,vi(w + 1,-inf));
            dp[1][1] = a[1][1] + mid;
            if(dp[1][1] < p[1]){
                l = mid + 1;
                continue;
            }
            dp[1][1] -= p[1];
            for(int i = 1;i <= h;i++){
                for(int j = 1;j <= w;j++){
                    if(i == 1 && j == 1) continue;
                    if(max(dp[i - 1][j],dp[i][j - 1]) == -inf) continue;
                    dp[i][j] = max(dp[i - 1][j],dp[i][j - 1]) + a[i][j];
                    if(dp[i][j] < p[i + j - 1]) dp[i][j] = -inf;
                    else dp[i][j] -= p[i + j - 1];
                }
            }
            if(dp[h][w] != -inf) cnt = mid,r = mid - 1;
            else l = mid + 1;
        }
        cout<<cnt;
        return 0;
    }
    ```
