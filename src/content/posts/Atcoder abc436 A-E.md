---
title: "Atcoder abc436 A-E"
published: 2025-12-20
description: ""
image: "/covers/Atcoder-abc436-A-E.jpg"
tags: ["题目"]
category: "题解"
draft: false
lang: ""
pinned: false
---
# A-o-padding:

无需多言，循环输出 $n- len(s)$ 次字符 "o",输出完直接输出 s。

<details>
<summary>代码</summary>

```cpp
# include<bits/stdc++.h>
using namespace std;
int n;
string s;
int main(){
    cin >> n >> s;
    for(int i = 1;i <= n - s.size();i++) cout<<"o";
    cout<<s;
    return 0;
}
```
</details>

# B-Magic Square:
无需多言，模拟即可。不过有个卡人的点，就是在减一时，为了避免负数的情况，
需要加上一个 $n$ ，这点用同余可以证明出取余绝对值不变.

<details>
<summary>代码</summary>

```cpp
# include<bits/stdc++.h>
using namespace std;
int n,r,c,a[250][250];
int main(){
    cin >> n;
    a[0][(n - 1) / 2] = 1;
    r = 0,c = (n - 1) / 2;
    for(int i = 1;i <= n * n - 1;i++){
        int k = a[r][c];
        int nr = (r - 1 + n) % n;
        int nc = (c + 1) % n;
        if(a[nr][nc]){
            r = (r + 1) % n; //要加n
            a[r][c] = k + 1;
        }else{
            r = nr;
            c = nc;
            a[r][c] = k + 1;
        }
    }
    for(int i = 0;i < n;i++){
        for(int j = 0;j < n;j++)
            cout<<a[i][j]<<" ";
        cout<<'\n';
    }
    return 0;
}
```
</details>
# C:2x2 Placing:

无需多言，不需要存状态，只需要判断是否有坐标相差小于1即可判断是否重叠。
关于存状态可以使用set存储，只需套个pair即可.

<details>
<summary>代码</summary>

```cpp
# include<bits/stdc++.h>
using namespace std;
int n, m,ans;
set<pair<int, int> > s;
int main(){
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int r, c;
        cin >> r >> c;
        bool flag = true;
        for (int x = r - 1; x <= r + 1; x++){
            for (int y = c - 1; y <= c + 1; y++){
                if (s.find({x, y}) != s.end()){
                    flag = false;
                    break;
                }
            }
        }
        if(!flag) continue;
        s.insert({r, c});
        ans++;
    }
    cout << ans << endl;
    return 0;
}

```
</details>

# D:Teleport Maze:

我是**QAQ

正常的01最短路，走过的就别走了，记得传送门要做好标记，每个字母的传送门传一次就行了.

<details>
<summary>代码</summary>

```cpp
# include<bits/stdc++.h>
using namespace std;
const int inf = 1e9;
bool seen[30];
int h,w,dis[1005][1005];
int dx[5] = {0,0,1,-1};
int dy[5] = {1,-1,0,0};
char s[1005][1005];
queue<pair<int,int>> q;
vector<vector<pair<int,int>>> ls(30);
int main(){
    cin >> h >> w;
    for(int i = 1;i <= h;i++){
        for(int j = 1;j <= w;j++){
            cin >> s[i][j];
            if(s[i][j] >= 'a' && s[i][j] <= 'z')
                ls[s[i][j] - 'a'].push_back({i,j});
        }
    }
    for(int i = 1;i <= h;i++)
        for(int j = 1;j <= w;j++)
            dis[i][j] = inf;
    dis[1][1] = 0;
    q.push({1,1});
    while(!q.empty()){
        auto tmp = q.front();
        q.pop();
        for(int i = 0;i < 4;i++){
            int nx = tmp.first + dx[i];
            int ny = tmp.second + dy[i];
            if(nx < 1 || nx > h || ny < 1 || ny > w) continue;
            if(s[nx][ny] == '#' || dis[nx][ny] != inf) continue;
            dis[nx][ny] = dis[tmp.first][tmp.second] + 1;
            q.push({nx,ny});
        }
        if(s[tmp.first][tmp.second] >= 'a' && s[tmp.first][tmp.second] <= 'z'){
            int c = s[tmp.first][tmp.second] - 'a';
            if(seen[c]) continue;
            seen[c] = true;
            for(auto p : ls[c]){
                if(dis[p.first][p.second] != inf) continue;
                dis[p.first][p.second] = dis[tmp.first][tmp.second] + 1;
                q.push({p.first,p.second});
            }
        }
    }
    int ans = dis[h][w];
    cout<<(ans == inf ? -1 : ans);
    return 0;
}
```
</details>

# E:Minimum Swap：

考完补题才发现这居然是一个老问题了。这里找到一篇博客记载了[排序还原](https://blog.csdn.net/gettogetto/article/details/69389810)这个问题(垃圾csdn).

这道题便是在此问题上扩展，既然要求多少种方案，那么每一个环内都有 $n(n-1) / 2$ 种方案，其中n为环的节点数量。
由于环与环之间存在联系，所以只需用加法原理，将每一个环的方案相加即可.
>还有一定要记住，不开( )见祖宗!

<details>
<summary>代码</summary>

```cpp
# include<bits/stdc++.h>
# define int long long
using namespace std;
bool vis[300005];
int n,ans,p[300005];
vector<int> G[300005];
int dfs(int x){
    int res = 1;
    vis[x] = true;
    for(auto y : G[x]){
        if(vis[y]) continue;
        res += dfs(y);
    }
    return res;
}
signed main(){
    cin >> n;
    for(int i = 1;i <= n;i++){
        cin >> p[i];
        G[p[i]].push_back(i);
    }
    for(int i = 1;i <= n;i++){
        if(vis[i]) continue;
        int tmp = dfs(i);
        ans += tmp * (tmp - 1) / 2;
    }
    cout<<ans;
    return 0;
}
```
</details>
