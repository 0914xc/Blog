---
title: 从Tomcat的Pipeline中学习责任链模式
date: 2022-05-07 20:53:09
categories: Tomcat
---

从前面的文章中，我们已经了解了Tomcat的整体架构，那当一个请求到达Tomcat的时候，是如何被处理的呢？

Tomcat由Container和Connector两部分组成。当网络请求过来的时候，被Connector包装为Request，然后交由Container处理，最终返回给请求方。Container的顶层是Engine，但是当请求到达Engine的时候，并不会直接调用Host去处理请求，而是调用了Pipeline组件组件，和Pipeline相关的还有个Value组件。

如果把不同的容器想象成一个独立的个体，那么Pipeline就可以理解为链接不同Container的一条渠，Valve是渠中的阀门，Request是水，Servlet是田。水会经过渠到达田，但最终能否到达，由阀门控制。

#### Valve
```java
public interface Valve {

    public String getInfo();

    public Valve getNext();

    public void setNext(Valve valve);

    public void backgroundProcess();

    public void invoke(Request request, Response response) throws IOException, ServletException;

    public void event(Request request, Response response, CometEvent event) throws IOException,ServletException;
    
    public boolean isAsyncSupported();
	
}
```

Tomcat共有四种容器，每个容器都有自己的Pipeline组件，每个Pipeline至少会设定一个Valve，这个Valve被称之为BaseValve，基础阀。基础阀的作用是连接当前容器的下一个容器。

#### Pipeline
```java
public interface Pipeline {

    public Valve getBasic();

    public void setBasic(Valve valve);

    public void addValve(Valve valve);

    public Valve[] getValves();

    public void removeValve(Valve valve);

    public Valve getFirst();

    public boolean isAsyncSupported();

    public Container getContainer();

    public void setContainer(Container container);

}
```
StandardPipeline
```java
public class StandardPipeline extends LifecycleBase implements Pipeline, Contained {
    @Override
    protected synchronized void startInternal() throws LifecycleException {

        // Start the Valves in our pipeline (including the basic), if any
        Valve current = first;
        if (current == null) {
            current = basic;
        }
        while (current != null) {
            if (current instanceof Lifecycle)
                ((Lifecycle) current).start();
            current = current.getNext();
        }

        setState(LifecycleState.STARTING);
    }
}
```

### 总结
从上面的分析内容中不难发现，Pipeline中的责任链模式和标准的责任链模式还是有区别的。

标准的责任链分为：抽象处理者Handler、具体处理者ConcreteHandler、创建链的Client。但是在Pipeline中这种关系并没有区分的那么明显，
