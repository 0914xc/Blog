---
title: 了解Tomcat中Lifecycle的设计
date: 2022-05-07 20:53:10
categories: Tomcat
---

> 本文的主要目的是分析Tomcat生命周期管理的


Catalina是Tomcat的核心组件，是Servlet容器，Catalina包含了所有的Container组件。

当Catalina启动时，它下面的组件也会一起启动，同样，当Catalina关闭时，这些组件也会随之关闭。为了可以方便的对这些组件进行启停操作，Tomcat通过给这些组件添加生命周期来进行统一的管理。

Catalina在设计上允许一个组件包含其他组件，父组件负责启动/关闭它的子组件。Catalina的这种设计使得所有组件都在父组件的“监护”之下，Catalina的启动类只需要启动一个组件，就可以将全部组件都启动起来。

## Lifecycle相关接口及抽象类
首先，需要了解每一个与Lifecycle相关的接口及抽象类，清楚其在Tomcat生命周期管理中的作用。
### Lifecycle
生命周期的最顶层接口，在接口中定义了一些最基本的生命周期事件，以及一些基础的方法。
```java
/**
 * Common interface for component life cycle methods.  Catalina components
 * may implement this interface (as well as the appropriate interface(s) for
 * the functionality they support) in order to provide a consistent mechanism
 * to start and stop the component.
 */
public interface Lifecycle {
    String BEFORE_INIT_EVENT = "before_init";
    String AFTER_INIT_EVENT = "after_init";
    String START_EVENT = "start";
    String BEFORE_START_EVENT = "before_start";
    AFTER_START_EVENT = "after_start";
    String STOP_EVENT = "stop";
    String BEFORE_STOP_EVENT = "before_stop";
    String AFTER_STOP_EVENT = "after_stop";
    String AFTER_DESTROY_EVENT = "after_destroy";
    String BEFORE_DESTROY_EVENT = "before_destroy";
    String PERIODIC_EVENT = "periodic";
    
    void init() throws LifecycleException;
    
    void start() throws LifecycleException;
    
    void stop() throws LifecycleException;
    
    void destroy() throws LifecycleException;
    
    void addLifecycleListener(LifecycleListener listener);
    LifecycleListener[] findLifecycleListeners();
    void removeLifecycleListener(LifecycleListener listener);
}
```
可以看到生命周期大致分为`init``start``stop``destroy`,而每一个生命周期都有可能有`berfore`事件，也可能有`after`事件。除此以外Lifecycle接口还定义了一些对事件监听器`LifecycleListener`基本操作，包含添加、查找和删除。组件中可以注册多个事件监听器来对发生在该组件上的某些事件进行监听。

### LifecycleEvent
Catalina使用LifecycleEvent来代表一个生命周期事件。
```java
public final class LifecycleEvent extends EventObject {

    private static final long serialVersionUID = 1L;

    /**
     * The event data associated with this event.
     */
    private final Object data;
    
    /**
     * The event type this instance represents.
     */
    private final String type;

    /**
     * Construct a new LifecycleEvent with the specified parameters.
     *
     * @param lifecycle Component on which this event occurred
     * @param type Event type (required)
     * @param data Event data (if any)
     */
    public LifecycleEvent(Lifecycle lifecycle, String type, Object data) {
        super(lifecycle);
        this.type = type;
        this.data = data;
    }
}
```
Lifecycle的构造函数需要传递一个Lifecycle的实例，也就是事件源。参数type就是Lifecycle中定义的事件类型常量。参数data则是携带的一些参数。

### LifecycleListener
生命周期的监听器，监听触发的生命周期事件。
```java
public interface LifecycleListener {

    /**
     * Acknowledge the occurrence of the specified event.
     *
     * @param event LifecycleEvent that has occurred
     */
    public void lifecycleEvent(LifecycleEvent event);

}
```
LifecycleListener在组件初始化的时候被添加到组件内部。在LifecycleListener中只定义了一个`lifecycleEvent(LifecycleEvent)`方法，当某个监听器监听到相关事件发生时，会调用该方法。

### LifecycleState
LifecycleState是一个枚举，用来表示生命周期事件对应的状态。
```java
public enum LifecycleState {
    NEW(false, null),
    INITIALIZING(false, Lifecycle.BEFORE_INIT_EVENT),
    INITIALIZED(false, Lifecycle.AFTER_INIT_EVENT),
    STARTING_PREP(false, Lifecycle.BEFORE_START_EVENT),
    STARTING(true, Lifecycle.START_EVENT),
    STARTED(true, Lifecycle.AFTER_START_EVENT),
    STOPPING_PREP(true, Lifecycle.BEFORE_STOP_EVENT),
    STOPPING(false, Lifecycle.STOP_EVENT),
    STOPPED(false, Lifecycle.AFTER_STOP_EVENT),
    DESTROYING(false, Lifecycle.BEFORE_DESTROY_EVENT),
    DESTROYED(false, Lifecycle.AFTER_DESTROY_EVENT),
    FAILED(false, null);
    
    LifecycleState(boolean available, String lifecycleEvent) {
        this.available = available;
        this.lifecycleEvent = lifecycleEvent;
    }
}
```

### LifecycleBase
LifecycleBase是直接继承自Lifecycle的抽象类，它基本实现了所有关于生命周期的功能。
```java
public abstract class LifecycleBase implements Lifecycle {
    
    /**
     * The list of registered LifecycleListeners for event notifications.
     */
    private final List<LifecycleListener> lifecycleListeners = new CopyOnWriteArrayList<>();
    
    @Override
    public void addLifecycleListener(LifecycleListener listener) {
        lifecycleListeners.add(listener);
    }
    
    @Override
    public LifecycleListener[] findLifecycleListeners() {
        return lifecycleListeners.toArray(new LifecycleListener[0]);
    }
    
    @Override
    public void removeLifecycleListener(LifecycleListener listener) {
        lifecycleListeners.remove(listener);
    }
    
    /**
     * Allow sub classes to fire {@link Lifecycle} events.
     *
     * @param type  Event type
     * @param data  Data associated with event.
     */
    protected void fireLifecycleEvent(String type, Object data) {
        LifecycleEvent event = new LifecycleEvent(this, type, data);
        for (LifecycleListener listener : lifecycleListeners) {
            listener.lifecycleEvent(event);
        }
    }
    
    public void init() throws LifecycleException {
        initInternal();
    }
    
    public void start() throws LifecycleException {
        startInternal();
    }
    
    public void stop() throws LifecycleException {
        stopInternal();
    }
    
    public void destroy() throws LifecycleException {
        destroyInternal();
    }
    
    protected abstract void initInternal() throws LifecycleException;
    protected abstract void startInternal() throws LifecycleException;
    protected abstract void stopInternal() throws LifecycleException;
    protected abstract void destroyInternal() throws LifecycleException;
}
```
从源码上我们可以把LifecycleBase类的功能分为两部分。第一部分是LifecycleListener相关功能，第二部分是生命周期相关功能。

关于第一部分，首先实现了LifecycleListener中定义的关于监听器的添加、查找和删除方法。然后，自定义了`fireLifecycleEvent()`方法，子类调用该方法时，会传入生命周期事件类型（在Lifecycle中定义的常量）。该方法接收到生命周期事件类型后，会构造相应的生命周期事件，并将当前组件作为**事件源**。这个生命周期事件会传递给这个组件下的所有事件监听器，每个监听器会根据事件类型做出相应的响应。

关于第二部分，可以很明显的看到用了模板设计模式。因为每个组件都要执行`init()`、`start()`、`stop()`、`destroy()`，而这些方法的大致行为又类似，所以在LifecycleBase中对这些方法做了默认实现，子类的特殊动作定义在`initInternal()``startInternal()``stopInternal()`、`destroyInternal()`。
