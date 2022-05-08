---
title: 怎么使用Logback日志框架？
date: 2022-05-07 20:52:59
categories: Java
---
首先，在`pom.xml`中引入Maven依赖。

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.12</version>
</dependency>
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-core</artifactId>
    <version>1.2.6</version>
</dependency>

<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.6</version>
</dependency>
```

然后，在resources文件夹中添加`logback.xml`文件，设置日志的输出格式。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="false">
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS}  %highlight(%-5level) --- [%+15thread] %cyan(%-36logger{36}) : %msg%n</pattern>
        </encoder>
    </appender>

    <root level="DEBUG">
        <appender-ref ref="STDOUT"/>
    </root>
</configuration>
```

最后，在Java代码中使用，并查看控制台的输出结果。

```java
public class Bootstrap {

    final static Logger logger = LoggerFactory.getLogger(Bootstrap.class);

    public static void main(String[] args) {
        logger.info("start log!");
    }
}
```