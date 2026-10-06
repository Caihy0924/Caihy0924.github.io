---
title: "OI场上可能会用得到的算法模板QWQ(CSP-J_S)"
published: 2026-10-05
description: ""
image: "/covers/OI场上可能会用得到的算法模板QWQ-CSP-J_S-.jpg"
tags: ["题目", "算法"]
category: "模板"
draft: true
lang: ""
pinned: false
---
# 更新日志：

马上就要考J/S了，复习一下算法模板吧！
# CSP-J(还没写)

# CSP-S:

## 常用的STL：

### 对(pair)：

一个经常会用到的STL，相当于阉割版的**struct**，用一个元素存储了两种不同类型的元素。头文件是**<utility>**.

以下是操作介绍：

```cpp
定义：
pair<T1,T2> p;  //建立一个空的pair，名字为p，T1为第一个元素的数据类型，T2为第二个数据类型.
pair<T1,T2> p(v1,v2); //在第一个基础上，将两个元素初始化为v1和v2.
make_pair(v1,v2);  //以v1和v2的数据类型为元素类型创建一个pair。(这个东西是没有名字的！）

引用：

p1.first;  //引用对象p1中的第一个元素。
p1.second;  //同理，引用对象p2中的第二个元素。

二元运算符运算：

p1 < p2; //以字典序为比较的基准.先进行p1.first和p2.first之间的比较，如果相等则比较p1.second和p2.second。
p1 == p2;  //如果两个pair的first和second都分别相等，则判定为相等。

```
下面是使用实例：
```cpp
pair<int,int> p1; //创建元素类型都为int的空对象p1
pair<string,int> p2;  //同理，创建元素类型分别为string和int的空对象p2
高阶玩法：pair<int,vector<int> > p3;  //创建元素类型为int和vector<int>的空对象p3

pair<int,int> p4(91,13);  //创建元素类型都为int的对象p4，分别初始化为91和13
pair<string,int> p5("QWQ",13);  //创建元素类型为string和int的对象p5，分别初始化为"QWQ"和13
pair<string,int> p6(p5);  //没想到吧，初始化可以套用同类型的pair的初始化数值.
```

给一个实例：
```cpp
//vector套pair存有权图
vector<pair<int,int>> G[100005];
while(n--){
    int u , v w;
    cin >> u >> v >> w;
    G[u].push_back({v,w});
    G[v].push_back({u,w});
}
//访问
for(int i = 0;i < G[x].size();i++){
    if(vis[G[x][i]].first) continue;
    cost += G[x][i].second;
    dfs(G[x][i].first);
}
```

## # 集合(set):

集合一般被用作自动排序的数组，平均 $O(log\ n)$ 的复杂度使得在维护结构上有了很重大的作用。

操作演示:
```cpp
定义
set<int> s; //定义一个元素类型为int的set。
set<pair<int,int> > s1 //一样的，可以里面套pair。
set<int> s2(s); //和pair一样，可以通过套别的容器初始化
set<int> s3(b,e); //指定容器的迭代器开始和结束的标记。
set<int> s4(s2.begin,s2.begin() + 3); //可以规定某一块为初始化的值,也可以套数组

使用
s.insert(x);  往s中插入元素x，多个元素在内按照字典序排序(实际上是树形结构).
s.begin(); //调用最高位元素的指针(迭代器)
s.end(); //调用最低位元素的指针(迭代器)
s.clear(); //一键清屏
s.count(x); //查找x在s中出现的次数
s.empty(); //检查s是否为空，空则返回true，否则false。
s.erase(x); //删除括号内指定指针元素
s.find(x); //返回指定元素的指针(迭代器),找不到返回s.end()
s.lower/upper_bound(k); //返回第一个大于等于/大于k的元素的迭代器.
s.size(); //返回容器的长度
```
## # 迭代器- [ ]
