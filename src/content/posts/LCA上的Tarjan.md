---
title: "LCA上的Tarjan"
published: 2026-08-23
description: ""
image: "/covers/LCA上的Tarjan.jpg"
tags: ["算法"]
category: "算法笔记"
draft: false
lang: ""
pinned: false
---
# 0-前言：

在讲解 Tarjan 算法前，我们需要知道一个问题：你知道什么是 Tarjan 吗？

>以下摘自某度百科：
>
>罗伯特·塔扬（Robert Tarjan），1948 年 4 月 30 日出生于美国加利福尼亚州波莫纳，美国计算机科学家，普林斯顿大学教授。
>
>塔扬发明或合作发明了多个著名算法，包括用于解决最近公共祖先问题的 Tarjan 离线 LCA 算法、
>寻找有向图中强连通分量的 Tarjan 强连通分量算法，以及与霍普克罗夫特合作提出的首个线性时间平面图算法——Hopcroft-Tarjan 平面嵌入算法。

没错，这三个居然是一个人发明的！

当然，点进来，就说明你大概率是学信奥的。所以这篇博客就介绍一下 LCA 的 Tarjan、强连通分量的 Tarjan，以及无向图里的割点、桥和双连通分量——说白了，把整个 Tarjan 家族一网打尽。

---

# 1-LCA：

如果不熟悉 LCA（最近公共祖先）的话，先看 OiWiki 的介绍：
>![](/images/imported/3529174-20260822184813330-174752478.png)

LCA 一般有两种求法：一个是**倍增法**，另一个则是 **Tarjan 算法**。不过呢，这期不讲倍增，讲 Tarjan。

Tarjan 算法需要先说明，这是一种**离线算法**。那么，什么是离线算法？我们可以拿线段树举例。

>线段树的作用是维护某一段区间，并且，对于信息的存储，单段的信息会合并成一个更大的区间记录，
>使得查询时的复杂度可以降到 $O(\log n)$。（~~感觉讲多了~~）
>
>总之，在修改区间时，你并不需要去对应更新所有的元素，而是只需要修改对应的、与修改位置有关联的就可以。
>
>反之，来看 Tarjan。Tarjan 算法需要在你给出完整的图之后，它才一口气计算所有的 LCA；如果你想要在图还没有建完时去求 LCA，
>那么就需要从头到尾，所有点对的 LCA 都要计算一遍，而不只能单独处理对应部分的 LCA。
>
>因此对应的，上文的线段树我们称之为一种**在线算法**，而 Tarjan 则称之为一种**离线算法**。
>
>>所以遇到离线算法，而且还有请求查询之类的，以 Tarjan 为例，一般都会先记录下查询，在建完图后，再逐一计算。

接下来说 Tarjan 的核心。Tarjan 算法求 LCA 需要**一遍深度优先遍历**，在 DFS 中，我们走到路径尽头后会进行回溯，回到上一个路口。同理，这里的 DFS 也需要回溯。对于某个节点处于不同的阶段（未被访问 → 已访问但未回溯 → 回溯完成），所进行的操作也各不相同。

下面是算法流程，当中采用了[并查集](https://oi-wiki.org/ds/dsu/)（又一次结合 OiWiki）：

>1.对于给定的图，我们正常存入（方式随你便），但是对于需要查询 LCA 的点对，我们另外建一个图，并将这两个点用无向边连接起来。
>
>2.然后，从根节点（哪个题目有就用哪个，没有随你便）开始进行**一遍** DFS，我们通过 `vis` 数组来记录当前节点是否被访问以及回溯过，`fa` 数组来记录该节点的**根节点**。
>
>3.对于一个节点，我们默认其根节点（即 `fa` 值）为自身；在以这个结点为根节点的 DFS 全部遍历完毕（或者说访问完当前节点的子树）之后，将其 `fa` 值更新为其父节点。
>
>4.如果当前节点刚回溯完，而在另一个图中有对应的点，那么需要进行一次判断：如果其对应需要求 LCA 的点被访问过，那么 LCA 直接更新，结果为其 `fa` 值。
>
>>哦对了，由于前面说了这当中用了并查集（`fa` 数组），所以在 LCA 更新时，`fa` 值要更新到当前所属块中最高的祖先（即 `find` 函数）。

下面是代码展示，码风请品鉴：

```cpp
# include<bits/stdc++.h>
using namespace std;
int n,m,s,ans[500005],d[500005],v[500005],fa[500005];
vector<int> G[500005],q[500005],q_n[500005];
void add_query(int a,int b,int i){//即另一个图，专门存需要查询的点
    q[a].push_back(b); q_n[a].push_back(i);//q_n记录每一对请求的编号
    q[b].push_back(a); q_n[b].push_back(i);
}
int find(int x){//find函数，寻找并查集祖先节点
    if(fa[x] == x) return x;
    return fa[x] = find(fa[x]);
}
void tarjan(int x){
    v[x] = 1; //数字来表示访问状态，1是已访问
    for(int i = 0; i < G[x].size(); i++){
        int to = G[x][i];
        if(v[to]) continue;
        d[to] = d[x] + 1;
        tarjan(to);
        fa[to] = x;
    }
    for(int i = 0; i < q[x].size(); i++){
        int to = q[x][i];
        if(v[to]){//如果已经访问过则直接更新LCA结果
            ans[q_n[x][i]] = find(to);
        }
    }
    v[x] = 2;//子树也遍历完后，则更新为2，即已经完成了回溯
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(0); cout.tie(0);
    cin >> n >> m >> s;
    for(int i = 1; i < n; i++){
        int x, y;
        cin >> x >> y;
        G[x].push_back(y);
        G[y].push_back(x);
    }
    for(int i = 1; i <= n; i++) fa[i] = i;
    for(int i = 1; i <= m; i++){
        int x, y;
        cin >> x >> y;
        add_query(x, y, i);
    }
    tarjan(s);
    for(int i = 1; i <= m; i++)
        cout << ans[i] << '\n';
    return 0;
}
```

well，这么实惠的算法，复杂度怎么算？

根据只需要一遍 DFS 的复杂度来看，时间复杂度上应该是 $O(n+m)$，即边+点的复杂度。

but，由于其中并查集 `find` 函数的加入，复杂度为 $O(m\alpha(n+m,n)+n)$。（~~不要问我怎么计算，我也不会~~）

> 顺带一提：那个 `d` 数组（深度）在这份 LCA 代码里其实**没有用到**——深度是倍增法才要的。Tarjan 离线 LCA 靠的是并查集合并顺序，不需要记录深度，所以 `d` 是上一版思路留下的，可以删掉。

---

# 2-强连通分量（有向图）：

# 定义

在此之前，我们需要了解一些东西。

在有向图中，如果两个点之间可以互相连通，我们称之为两个点之间是**强连通**的。而强连通分量的定义，则是**极大**的强连通子图（即图中所含节点最多，任意两点之间强连通的子图）。

> 等等，"极大"这个词要较真。强连通分量要的是：这个点集内部任意两点都强连通，但要是再塞进任何一个别的点进去，它就不强连通了。一句话，**大到不能再大的"互相可达"团伙**。

那么，怎么用一遍 Tarjan 把它找出来？

# 需要的两个数组

Tarjan 求强连通分量，核心只维护两个东西：

- **`dfn[u]`**：DFS 进入点 `u` 的时间戳，也就是"第几个被访问到"。
- **`low[u]`**：`u` 的子树里，通过**一条非树边**能绕回去的最早的那个 `dfn` 值。说人话：`low[u]` 表示"我这支路，最远能顺着回路摸回多靠前的祖先"。

再配一个**栈**。凡是还在栈里的点，就意味着它"**还没找到归属**"。栈里存的，其实就是一条从根往下、还没定型的路。

# 算法流程

1. 从任意点开始 DFS，进点时记 `dfn[u] = low[u] = ++tot`，把 `u` 压入栈。
2. 遍历邻点 `v`：
   - 若 `v` 没访问过：递归下去，回来后 `low[u] = min(low[u], low[v])`——因为 `u` 的支路能顺到 `v` 支路摸到的最早祖先。
   - 若 `v` **还在栈里**：说明 `v` 是 `u` 的一条"回边"（或跨到还没定型的边），于是 `low[u] = min(low[u], dfn[v])`。
3. 等 `u` 的子树全处理完，若 `dfn[u] == low[u]`，说明 `u` 这支摸不出去了，自成一派——于是**一直出栈，直到弹出 `u` 为止**，这一整个栈段就是一个强连通分量。

一句话总结判定：**`dfn[u] == low[u]` 时，从栈顶到 `u` 这一整段就是一个 SCC。**

# 代码

```cpp
int dfn[N], low[N], tot, scc_cnt, scc[N];
stack<int> st;
bool in_stack[N];

void tarjan(int u){
    dfn[u] = low[u] = ++tot;
    st.push(u);
    in_stack[u] = true;
    for(int v : G[u]){
        if(!dfn[v]){                // 树边：往下走
            tarjan(v);
            low[u] = min(low[u], low[v]);
        }else if(in_stack[v]){      // 回边/横叉边，只有在栈里才有意义
            low[u] = min(low[u], dfn[v]);
        }
    }
    if(dfn[u] == low[u]){           // u 是当前 SCC 的"根"
        scc_cnt++;
        while(true){
            int x = st.top(); st.pop();
            in_stack[x] = false;
            scc[x] = scc_cnt;       // 记录 x 属于第几个分量
            if(x == u) break;
        }
    }
}
```

> **坑**：更新 `low` 用的是 `low[u] = min(low[u], dfn[v])`，也就是 **`dfn[v]`**，不是 `low[v]`。严谨写法一定是 `dfn[v]`；网上有些版本写成 `low[v]`，在存在横叉边的图里会算出偏小的 `low` 值，纯粹是碰运气。这个坑很多人都踩过。

# 复杂度 & 一个应用

一遍 DFS + 每个点进栈出栈各一次，所以是 **`O(n+m)`**。

求完 SCC 后最常用的操作是**缩点**：把每个分量看成一个点，分量之间的边连起来，整个有向图就变成一张 **DAG**。DAG 上就能干很多事——拓扑排序、求最长路、判断能不能成环等等。

---

# 3-割点与桥（无向图）：

前面讲的强连通分量是**有向图**的事。到了**无向图**，同样用 `dfn/low`，但关注的完全不一样：我们要找的是"**哪条边是图的关键边**"（桥）、"**哪个点是图的关键点**"（割点）。

# 割点——定义

**割点**：删掉这个点（以及它连出去的所有边）之后，图的连通分量数变多了。也就是说，这个点是"牵一发而动全身"的节点。

举个最直观的例子：`A - B - C` 一条链，删掉 `B`，图就断成 `A` 和 `C` 两半，所以 `B` 是割点。

# 割点——求法

无向图上跑一遍 DFS，同样维护 `dfn/low`。判定分两条：

- **根节点**：如果它在 DFS 树里有 ≥2 个孩子，那它就是割点。（因为删了它，两个子树各自独立，互不相通了。）
- **非根节点 `u`**：如果存在一个孩子 `v`，使得 `low[v] >= dfn[u]`，说明 `v` 的子树绕不到 `u` 上面去，删掉 `u` 就和上面断了，于是 `u` 是割点。

注意无向图的"去重"：我们**不能**把通往父亲的那条边当成回边去更新 `low`，所以要判断"`v` 不是当前节点的父亲"。

```cpp
int dfn[N], low[N], tot;
bool is_cut[N];

void tarjan(int u, int fa){
    dfn[u] = low[u] = ++tot;
    int child = 0;
    for(int v : G[u]){
        if(!dfn[v]){
            child++;
            tarjan(v, u);
            low[u] = min(low[u], low[v]);
            if(low[v] >= dfn[u]) is_cut[u] = true;     // 非根判定
        }else if(v != fa){                             // 不是父亲才更新 low
            low[u] = min(low[u], dfn[v]);
        }
    }
    if(fa == 0){                                       // 根单独判
        if(child >= 2) is_cut[u] = true;
        else is_cut[u] = false;
    }
}
```

# 桥——定义

**桥**（也叫割边）：删掉这条边之后，图的连通分量数变多了。还是 `A - B - C` 那条链，`A-B` 和 `B-C` 都是桥。

# 桥——求法

和割点长得几乎一样，只差一个符号：

- 对于树边 `(u, v)`（`v` 是 `u` 的孩子），若 `low[v] > dfn[u]`，则 `(u, v)` 是桥。

注意是 **`>`**，不是 `>=`。为什么？如果 `low[v] == dfn[u]`，说明 `v` 的子树能绕回 `u` 本身，删掉 `(u,v)` 之后 `v` 这边和 `u` 仍然连得通（走了别的路），所以它不是桥。

```cpp
int dfn[N], low[N], tot;
bool is_bridge[N];

void tarjan(int u, int fa){
    dfn[u] = low[u] = ++tot;
    for(int v : G[u]){
        if(!dfn[v]){
            tarjan(v, u);
            low[u] = min(low[u], low[v]);
            if(low[v] > dfn[u]) is_bridge[...] = true;  // 记下这条边是桥
        }else if(v != fa){
            low[u] = min(low[u], dfn[v]);
        }
    }
}
```

> **坑：多重边**。上面用"`v != fa`"判断父亲，但如果图里**两个点之间有多条边**（重边），这个写法会把树边另一条重边当成回边处理，桥就判错了。严谨做法是**按边编号**——DFS 时传入"进来那条边的编号"，回边判断改成 `eid != in_edge`。数据里可能有多重边的题，一定要用边编号版。下面§4 双连通分量的代码就用边编号。

# 对比一下这三个判定

| 对象 | 图类型 | 判定公式 | 备注 |
| ---- | ------ | ------- | ---- |
| 强连通分量 | 有向图 | `dfn[u] == low[u]` | 弹栈到 `u` 为止 |
| 割点 | 无向图 | `low[v] >= dfn[u]` | 根节点特殊：孩子 ≥ 2 |
| 桥 | 无向图 | `low[v] > dfn[u]` | 严格大于 |

---

# 4-双连通分量（无向图）：

既然有割点和桥，就能把无向图"切"成更小的块。这里有两套概念，别搞混。

# 边双连通分量（2-边连通分量）

**定义**：一个极大子图，里面**不含任何桥**。等价说法：子图里任意两点之间至少存在**两条边不相交**的路径。

**求法**：超简单——先把所有桥标出来，**删掉桥**，剩下的连通块就是边双连通分量。

```cpp
struct Edge{ int to, id; };            // 目标点 + 边编号
vector<Edge> G[N];

int dfn[N], low[N], tot;
bool is_bridge[M];

void tarjan(int u, int in_edge){       // in_edge：进来这条边的编号
    dfn[u] = low[u] = ++tot;
    for(auto e : G[u]){
        int v = e.to;
        if(!dfn[v]){
            tarjan(v, e.id);
            low[u] = min(low[u], low[v]);
            if(low[v] > dfn[u]) is_bridge[e.id] = true;   // 桥（严格大于）
        }else if(e.id != in_edge){                         // 走了别的边才更新
            low[u] = min(low[u], dfn[v]);
        }
    }
}

// 缩边双：不走桥，跑一遍连通块
int comp[N], comp_cnt;
void dfs_comp(int u){
    comp[u] = comp_cnt;
    for(auto e : G[u])
        if(!comp[e.to] && !is_bridge[e.id])
            dfs_comp(e.to);
}
```

# 点双连通分量（2-点连通分量）

**定义**：一个极大子图，里面**不含割点**。注意一个关键性质：**割点会同时属于多个点双连通分量**，而普通点只属于一个。

**求法**：用"**边栈**"配合 Tarjan。遍历邻点时把边压栈；一旦出现 `low[v] >= dfn[u]`（割点的判定条件），说明 `u` 和 `v` 之间"断开"了，于是把栈里的边一直弹出来，直到弹出 `(u, v)` 为止——弹出来的这些边上的点，就构成一个点双连通分量。

```cpp
struct Edge{ int u, v; };
vector<int> G[N];
vector<Edge> st;            // 边栈
vector<vector<int>> bcc;     // 每个点双的顶点集

int dfn[N], low[N], tot;

void tarjan(int u, int fa){
    dfn[u] = low[u] = ++tot;
    for(int v : G[u]){
        if(!dfn[v]){
            st.push_back({u, v});
            tarjan(v, u);
            low[u] = min(low[u], low[v]);
            if(low[v] >= dfn[u]){              // 割点条件，也是点双的"界"
                vector<int> cur;
                while(true){
                    Edge e = st.back(); st.pop_back();
                    cur.push_back(e.u);
                    cur.push_back(e.v);
                    if(e.u == u && e.v == v) break;
                }
                sort(cur.begin(), cur.end());               // 去重，每个点留一次
                cur.erase(unique(cur.begin(), cur.end()), cur.end());
                bcc.push_back(cur);
            }
        }else if(v != fa && dfn[v] < dfn[u]){   // 只对"回到祖先"的边入栈
            st.push_back({u, v});
            low[u] = min(low[u], dfn[v]);
        }
    }
}
```

# 双连通两种的对比

| 类型 | 内部不含 | 关键操作 | 割点/桥归属 |
| ---- | ------ | ------- | ---------- |
| 边双连通分量 | 桥 | 删桥后连通块 | 桥被切掉，不属于任何块 |
| 点双连通分量 | 割点 | 边栈，`low[v]>=dfn[u]` 弹边 | 割点属于多个块 |

---

# 小结：Tarjan 家族一览

整篇讲下来，虽然四个部分都叫 Tarjan、都跑 DFS，但关注点和判定式完全不同，放一起对比最清楚：

| 对象 | 图类型 | 核心判定 | 用的数据结构 |
| ---- | ------ | ------- | ---------- |
| LCA | 任意图 | 并查集 + 回溯 | 并查集 `fa` |
| 强连通分量 | 有向图 | `dfn[u] == low[u]` 弹栈 | 点点栈 |
| 割点 | 无向图 | `low[v] >= dfn[u]` | 无 |
| 桥 | 无向图 | `low[v] > dfn[u]` | 无 |
| 边双连通分量 | 无向图 | 删掉所有桥 | 边区编号 |
| 点双连通分量 | 无向图 | 边栈 + 割点条件弹边 | 边栈 |

记口诀的话：**有向图看"弹栈"，无向图看"比较"；点双用边栈，边双删桥。**
