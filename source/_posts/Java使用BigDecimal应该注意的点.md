---
title: Java使用BigDecimal应该注意的点 
date: 2022-05-06 22:57:34
categories: Java
---

**1. 禁止使用构造方法BigDecimal（double）的方式将double值转化为BigDecimal对象。**

因为这种方式存在精度损失风险，在精确计算或值比较的场景中可能会导致业务逻辑异常。 比如：`BigDecimal a = new BigDecimal(0.1F)`实际存储值为：0.10000000149

```Java
// 正确使用方式
BigDecimal a = new BigDecimal("0.1");
BigDecimal b = BigDecimal.valueOf(0.1);
```

**2. 慎用BigDecimal的equals()方法。**

```Java
public static void main(String[] args) {
    // 例1
    BigDecimal bigDecimal1 = new BigDecimal(1);
    BigDecimal bigDecimal2 = new BigDecimal(1);
    System.out.println(bigDecimal1.equals(bigDecimal2));
    
    // 例2
    BigDecimal bigDecimal3 = new BigDecimal(1);
    BigDecimal bigDecimal4 = new BigDecimal(1.0);
    System.out.println(bigDecimal3.equals(bigDecimal4));
    
    // 例3
    BigDecimal bigDecimal5 = new BigDecimal("1");
    BigDecimal bigDecimal6 = new BigDecimal("1.0");
    System.out.println(bigDecimal5.equals(bigDecimal6));
}
```

上面这段程序的执行结果为：

```Java
true
true
false
```

按理来说，既然例2的结果是`true`, 那么例3的结果也应该是`true`，因为它们都是将`1`和`1.0`进行比较。但实际执行结果却不是这样，为什么呢？

看一下BigDecimal中equals方法的源码：
```Java
public boolean equals(Object x) {
    if (!(x instanceof BigDecimal))
        return false;
    BigDecimal xDec = (BigDecimal) x;
    if (x == this)
        return true;
    // 先比较两个数的精度
    if (scale != xDec.scale)
        return false;
    long s = this.intCompact;
    long xs = xDec.intCompact;
    // 再比较两个数的值
    if (s != INFLATED) {
        if (xs == INFLATED)
            xs = compactValFor(xDec.intVal);
        return xs == s;
    } else if (xs != INFLATED)
        return xs == compactValFor(this.intVal);

    return this.inflated().equals(xDec.inflated());
}
```

在这个方法中，对于两个需要进行比较的数，它首先比较了这两个数的scale，再比较了这两个数的intCompact。

因为BigDecimal bigDecimal6 = new BigDecimal("1.0")的scale为1，所以bigDecimal5和bigDecimal6比较的结果为`false`。

那为什么bigDecimal3和bigDecimal4比较的结果为`true`呢？因为BigDecimal bigDecimal4 = new BigDecimal(1.0)的scale为0，1.0、1.00这种比较特殊，它们本质上就是1，所以scale就是0；

综上所述，在BigDecimal中，要比较两个数的大小，可以用其提供的`compareTo`方法。

```Java
// 如果两个数的值相等，则返回0
bigDecimal5.compareTo(bigDecimal6);
```