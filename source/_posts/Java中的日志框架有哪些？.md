---
title: Java中的日志框架有哪些？
date: 2022-05-07 20:52:58
categories: Java
---



> 工作了一段时间，越来越认识到日志的重要性，于是写下这篇文章帮自己梳理Java日志框架的脉络。


要了解Java中的日志框架，就要从两个方面去了解：日志框架的门面、日志框架的具体实现。

## 日志框架的门面

在日志框架中，通过门面模式（也称外观模式），实现了系统与具体实现日志框架的解耦。典型的日志门面：`Commons Logging`、`SLF4J`。

**Commons Logging**

Commons Logging基于动态绑定来实现日志的记录，在使用时只需要用它定义的接口编码即可，程序运行时会使用 ClassLoader 寻找和载入底层的日志库，因此可以自由选择由log4j或JUL来实现日志功能。

但是，Commongs Logging不能在OSGi服务平台中正常使用，原因是在OSGi中，不同的插件使用不同的ClassLoader以此来保证各个插件的独立性，而Commongs Logging却依赖ClassLoader寻找和载入日志库。

**SLF4J**

Slf4j在编译期间，静态绑定本地的log库，因此可以在OSGi中正常使用。它是通过查找类路径下org.slf4j.impl.StaticLoggerBinder，绑定工作都在这个类里面进行。

## 日志框架的具体实现

目前，常用的四种日志具体实现框架是：`Jul`、`Log4j`、`Log4j2`、`Logback`。

> 要了解这四种日志框架，可以先看看他们的发展历史。


在JDK1.3之前，因为没有日志框架，所以只能使用System.out.println()、System.err.println() 或者 e.printStackTrace()来打印日志。但是，这种日志记录方式无法实现定制化，且日志的输出粒度不够细。

于是，Log4j出现了，并几乎成为Java日志框架的标准。Log4j希望sun公司将其引入JDK，但被拒绝了。

随后，sun公司模仿Log4j，在JDK1.4中引入了JUL（java.util.logging）。

为了解耦日志接口与实现，2002年Apache推出了JCL(Jakarta Commons Logging)，也就是 Commons Logging。

Log4j的作者与Apache关于Commons-Logging制定的标准存在分歧，于是，又先后创建了Slf4j和Logback两个项目。Slf4j是一个日志门面，只提供接口，可以支持 Logback、JUL、Log4j 等日志实现，Logback提供具体的实现，它相较于log4j有更快的执行速度和更完善的功能。

为了维护在Java日志江湖的地位，防止 JCL、Log4j被Slf4j、Logback 组合取代 ，2014年Apache推出了 Log4j2。Log4j2与Log4j不兼容，经过大量深度优化，其性能显著提升。

