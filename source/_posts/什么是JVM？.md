---
title: 什么是JVM？
date: 2022-05-07 20:53:00
categories: Java
---
JVM是Java Virtual Machine（Java虚拟机）的缩写，它是可运行Java代码的假象计算机。这个“计算机”运行在操作系统之上，因此，它与硬件没有直接的交互。

简单来说，JVM由一套字节码指令集、一组寄存器、一个栈、一个垃圾回收堆和一个存储方法域等组成。

### JRE、JDK和JVM的关系

**JVM（Java Virtual Machine， Java虚拟机）**
JVM主要工作是解释自己的指令集（即字节码）并映射到本地的CPU指令集和OS的系统调用。Java语言是跨平台运行的，不同的操作系统会有不同的JVM映射规则，使之与操作系统无关，完成跨平台性。

**JRE（Java Runtime Environment， Java运行环境）**
JRE是Java平台，所有的程序都要在JRE下才能够运行。包括JVM、Java核心类库、支持文件。

**JDK（Java Development Kit，Java开发工具包）**
JDK是用来编译、调试Java程序的开发工具包。它集成了JRE和一些Java工具（javac/java/jdb等）。

因此，这三者是一层层的嵌套关系：JDK > JRE > JVM
![](https://cdn.jsdelivr.net/gh/wxc0914/image/e16d8ed62bf7d0e5fc600553f0198c90.jpeg)



### 为什么Java可以跨平台，实现“一次编译，多处运行”？
首先，一定要明白一个点，Java代码之所以可以跨平台，是因为“JVM可以跨平台”。Java代码，经过编译器后，被编译成class文件（字节码文件），这个字节码，在不同平台的JVM上会映射到不同系统的API调用。

正因为这一点，Java可以不需要考虑在代码层面对平台的兼容性。

我们的操作系统，真正执行的代码，是他所能识别的机器语言，像Java语言、C语言等，并不能直接执行，而需要经过编译器，翻译成操作系统所能看懂的机器码。值得注意的是，不同的平台，其机器码（执行的指令）是有所差别的。所以，同一份源程序，在经过不同平台的编译器翻译过后，其结果也是略有差别的。

Java语言为了实现“跨平台”，在将代码编译成机器码之前，先将其编译成“字节码文件”。让不同的平台，拿到的“字节码文件”是相同的，平台再将这份字节码翻译成其所能识别的机器码，而从字节码到机器码这个过程，就是由JVM完成的。不同的平台机器码有所差别，因此不同的平台的JVM也是不同的。

![](https://cdn.jsdelivr.net/gh/wxc0914/image/8fbeb65fdda2787b0f43b03b815af766.jpeg)
