---
title: "jr数学的退休生活-2"
published: 2025-08-15
description: ""
image: "/covers/jr数学的退休生活-2.jpg"
tags: ["数论"]
category: "数学"
draft: false
lang: ""
pinned: false
---
# 欧拉函数：

伟大的数学家欧拉定义了这样一个函数：$\phi(n)$ .他的定义很简单，在 $1,2,...,n$ 里与 $n$ **互质** 的数的数量。如果要表示里面的每一个数表示，那便是：

$$
\forall n,x \in N,x \le n \Longrightarrow gcd(x,n) = 1
$$

那么这样一个函数，该怎么求呢？

# 求法(容斥/通项公式):

如果考虑使用容斥原理，我们就需要先算出所有**不互质**的数**，**对于一个整数 $n$ 其可以被表示为 $p_1^{a_1} + p_2^{a_2} + ,..., + p_m^{a_m}$ 的形式，由于不同的情况之间会有重复的情况，所以在减的过程中也要把重复的加回去。最终的结果为：

$$

n - \frac{n}{p_1} - \frac{n}{p_2} - ...-\frac{n}{p_n} \\ 
+ \frac{n}{p_1p_2} + \frac{n}{p_1p_3} + ... + \frac{n}{p_{m-1}p_m} 
\\ ... \\ + (-1)^{m + 1} \frac{n}{p_1p_2...p_m} 
$$

而除此之外还有一种求法：

$$
\phi(n) = n \prod^{m}_{i=1} (1 - \frac{1}{p_i})
$$

而下面这个公式，和上面是同一个，将开头的 $n$ 乘进括号后，在根据二项式定理展开可得，分数前面的正负由选择 $p_i$ 的数量决定，奇负偶正。

下面是根据方法二写出的代码：

- 代码：
    
    ```cpp
    #include<bits/stdc++.h>
    #define int long long
    using namespace std;
    int n;
    int phi(int x){
    	int res = x;
    	while(int i = 2;i * i <= x;i++){
    		if(x % i == 0){
    			while(x % i == 0) x /= i;
    			res -= res / i;
    		}
    	}
    	if(x > 1) res -= res / x;
    }
    signed main(){
    	cin >> n;
    	cout<<phi(n);
    	return 0;
    }
    ```
    

# 扩展：

> 定理1：1到 $n$ 中与 $n$ 互质的数之和结果为 $\frac{n \cdot \phi(n)}{2}$.
> 
>>证明：
>>
>>由于满足 $gcd(n,x) = gcd(n,n - x)$ 的性质，用同余便能理解，所以不互质的数都是一对一对的(两个相同也算),
>>平均值为 $n/2$(总共 n/2 组，每组相加都为 n) ,所以同理，
>>互质的数，即gcd为1的数平均值也为 $n / 2$ ,所以总和为 $frac{n \cdot \phi(n)}{2}$ .
>>
>>证毕.
>
> 定理2：两个整数 $a,b$ 互质，则满足 $\phi(a\cdot b)=\phi(a) \cdot \phi(b)$
> 
> > 此定理其实是积性函数的一个应用。
> > 
> 
> 扩展1：$\phi(p) = p-1 (p \in P)$.
> 

# 欧拉定理：

对于两个整数 $a,n$ ,在a和n互质的情况下，满足 $a^{\phi(n)} \equiv 1(mod\ n)$ .

这定义是不是很熟悉？当 $\phi(n)$  结果为 $n-$1 时，欧拉定理就演变成了费马小定理。

# 中国剩余定理：

现在看一下这道问题：

$$
\text{有物不知其数}，\text{三三数之剩二}，\text{五五数之剩三}，\text{七七数之剩二}。\text{问物几何}？ ——《\text{孙子算经}》
$$

如果翻译成现代文的意思，就是一个整数除以三余二，除以五余三，除以七余二，求这个整数。

我们将其传化为数学形式，得到了一个同余方程组：

$$
\begin{cases} x \equiv 2(mod\ 2)\\ x \equiv 3(mod\ 5)\\ x \equiv 2(mod\ 7)\end{cases}
$$

那么这个问题该如何解决呢？

在一般的情况下，我们只求最小可能值。下面是该方法的流程：

> 对于每一种除数 $m_i$ ,我们都需要构造模 $m_i$ 的结果为 $a_i$ ，模其他的数为0的特殊数字 $t_i$.:
> 
> 1. 对于每一个数字 $t_i$ ,其构造方法为 $t_i$ 乘除了 $m_i$ 以外其他除数的乘积再乘其在模 $m_i$ 状态下的逆元。
> 2. 将每一个数字 $t_i$ 相加后，最后取余所有除数的乘积即为方程组的最小解。

为什么操作一是这样的？我们要构造出的数要符合每个方程组的条件，之所以要再乘一个逆元，根据逆元的定义，满足两个数相乘的结果模之后为1，这样的数在最终取余时可以被别的数整除，也能满足当前余数的条件。

例题：P1945

```cpp
# include<bits/stdc++.h>
# define int long long
using namespace std;
int n,a[15],b[15],cnt,ans = 1;
int exgcd(int a,int b,int &x,int &y){
    if(a == 0 && b == 0){x = y = 0;return 0;}
    if(b == 0){
        x = (a >= 0 ? 1 : -1);
        y = 0;
        return a >= 0 ? a : -a;
    }
    int x1 , y1;
    int g = exgcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}
int exgcd_inverse(int a,int b){
    int x , y;
    int g = exgcd(a,b,x,y);
    if(g != 1) return -1;
    x %= b;
    x = (x + b) % b;
    return x;
}
signed main(){
    ios::sync_with_stdio(false);
    cin.tie(0);cout.tie(0);
    cin >> n;
    for(int i = 1;i <= n;i++){
        cin >> a[i] >> b[i];
        ans *= a[i];
    }
    //中国剩余定理
    for(int i = 1;i <= n;i++){
        int k = ans / a[i];
		int x , y;
		exgcd(k , a[i] , x , y);
		cnt = cnt +  k * b[i] * x % ans;
    }
    cout <<((cnt % ans) + ans) % ans;
    return 0;
}
```

# 扩展欧几里得：

扩展欧几里得(exgcd)在欧几里得算法(gcd)的基础上，进一步拓展以解决如 $ax + by = c$ 这类的问题，
算法很简单，但想要理解是一件困难的事.
