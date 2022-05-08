---
title: Integer.valueOf()与Integer.parseInt()方法比较
date: 2022-05-07 20:31:44
categories: Java
---

最近看到这样一段代码：

```Java
int a = Integer.valueOf("10");
```

首先这段代码是可以正常运行的，但是Idea却给出了提示：
![Image](https://cdn.jsdelivr.net/gh/wxc0914/image/425bf78f92b476ebd349ebd0e7e1acae.png)

boxing翻译过来是装箱的意思，换句话说，在这里进行了重复的装箱操作（注：自动拆箱、装箱是JDK1.5以后的一个新特性）。

那Integer.valueOf()到底做了什么呢？可以看一下其源代码：

```Java
public static Integer valueOf(String s) throws NumberFormatException {
    return Integer.valueOf(parseInt(s, 10));
}
```

可以看到，其内部其实就是调用了，Integer.parseInt()。

继续看一下parseInt的源代码:

```Java
public static int parseInt(String s, int radix) throws NumberFormatException {
    ....
}
```

内部具体的转换逻辑就不看了，但是我们可以看到两个方法明显的差别：parseInt的返回类型是int，而valueOf的返回类型是int的包装类型Integer。

这也就不难理解，上面的代码为什么Idea给出提示了，因为我们的变量a是int型的。如果我们用valueOf方法，会将parseint的返回值转成Intger类型，然后JDK又会自动拆箱成a需要的int型。

例如，下面的代码就不会报错

```Java
Integer a = Integer.valueOf("10");
```