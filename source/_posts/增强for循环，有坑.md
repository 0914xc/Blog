---
title: 增强for循环，有坑
date: 2022-05-07 20:52:48
categories: Java
---
先看一下增强For的实现机制


Java中有fail-fast机制，在使用迭代器遍历元素的时候，如果对被遍历的集合中的元素进行删除，有可能会发生ConcurrentModificationException。

原因：Iterator是工作在一个独立的线程中，并且拥有一个mutex锁，Iterator被创建之后会建立一个指向原来对象的单链索引表，当原来的对象数量发生变化时，这个索引表的内容不会同步改变，所以当索引指针往后移动的时候，就找不到要迭代的对象，所以按照fail-fast原则，Iterator会马上抛出异常。

所以Iterator在工作的时候，是不允许被迭代的对象被改变的。
但可以使用Iterator本身的方法remove() 来删除对象，Iterator.remove() 方法会在删除当前迭代对象的同时维护索引的一致性。