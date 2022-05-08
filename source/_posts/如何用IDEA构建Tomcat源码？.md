---
title: 如何用IDEA构建Tomcat源码？
date: 2022-05-07 20:53:07
categories: Tomcat
---

> 本文基于Tomcat8.5.75

### 获取源码
首先，[进入Tomcat官网，下载源码](https://tomcat.apache.org/download-80.cgi?spm=a2c6h.12873639.0.0.4d642b881C9FTC&file=download-80.cgi)。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1644751817006-ee8459e4-f30d-4a96-9bc8-ad9b8d2d0342.png#clientId=u2dba5ab7-e5ec-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=551&id=u7d0b0559&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1102&originWidth=1342&originalType=binary&ratio=1&rotation=0&showTitle=false&size=186777&status=done&style=none&taskId=ud7cd1e6c-fd15-48a4-ad5e-ec5adbfb27b&title=&width=671)
然后，解压文件。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1644752365250-98695adc-a04a-49a1-93d3-15781e7812aa.png#clientId=u69e1d5b5-ba6b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=500&id=ua3a23b49&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1000&originWidth=1884&originalType=binary&ratio=1&rotation=0&showTitle=false&size=326047&status=done&style=none&taskId=ud8ec4379-1702-44d2-bdf9-206a609d551&title=&width=942)

### 导入IDE前的准备工作

1. 在`apache-tomcat-8.5.75-src`目录下添加`pom.xml`文件。
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

  <modelVersion>4.0.0</modelVersion>
  <groupId>org.apache.tomcat</groupId>
  <artifactId>Tomcat8.5</artifactId>
  <name>Tomcat8.5</name>
  <version>8.5.75</version>

  <build>
    <finalName>Tomcat8.5</finalName>
    <sourceDirectory>java</sourceDirectory>
    <testSourceDirectory>test</testSourceDirectory>
    <resources>
      <resource>
        <directory>java</directory>
      </resource>
    </resources>
    <testResources>
      <testResource>
        <directory>test</directory>
      </testResource>
    </testResources>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.8.1</version>
        <configuration>
          <encoding>UTF-8</encoding>
          <source>1.8</source>
          <target>1.8</target>
        </configuration>
      </plugin>
    </plugins>
  </build>

  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.13.2</version>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.easymock</groupId>
      <artifactId>easymock</artifactId>
      <version>4.3</version>
    </dependency>
    <dependency>
      <groupId>ant</groupId>
      <artifactId>ant</artifactId>
      <version>1.7.0</version>
    </dependency>
    <dependency>
      <groupId>wsdl4j</groupId>
      <artifactId>wsdl4j</artifactId>
      <version>1.6.3</version>
    </dependency>
    <dependency>
      <groupId>javax.xml</groupId>
      <artifactId>jaxrpc</artifactId>
      <version>1.1</version>
    </dependency>
    <dependency>
      <groupId>org.eclipse.jdt.core.compiler</groupId>
      <artifactId>ecj</artifactId>
      <version>4.6.1</version>
    </dependency>
    <dependency>
      <groupId>com.unboundid</groupId>
      <artifactId>unboundid-ldapsdk</artifactId>
      <version>6.0.3</version>
    </dependency>
  </dependencies>
</project>
```

2. 在 `apache-tomcat-8.5.75-src`目录下新建 `source`目录，并将`conf`和`webapps`移动到该目录下。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1645362440672-9804d133-c59c-414a-845c-b1926b1072f7.png#clientId=u919e23c1-d19a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=488&id=u02529075&margin=%5Bobject%20Object%5D&name=image.png&originHeight=976&originWidth=1840&originalType=binary&ratio=1&rotation=0&showTitle=false&size=323813&status=done&style=none&taskId=u958af7e6-9c97-48f9-a551-7190f6f3e61&title=&width=920)
### 启动程序
首先，设置虚拟机启动参数（VM options），IDEA添加方式如下图所示：
```bash
-Dcatalina.home=/Users/weixiaochen/Documents/apache-tomcat-8.5.75-src/source
-Dcatalina.base=/Users/weixiaochen/Documents/apache-tomcat-8.5.75-src/source
-Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager
-Djava.util.logging.config.file=/Users/weixiaochen/Documents/apache-tomcat-8.5.75-src/source/conf/logging.properties
-Dfile.encoding=UTF-8
```
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1645362685988-143b655a-5b23-4cf2-b96a-4f00c0a15758.png#clientId=u919e23c1-d19a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=791&id=yh0BB&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1582&originWidth=2874&originalType=binary&ratio=1&rotation=0&showTitle=false&size=459976&status=done&style=none&taskId=u51f82ff7-af50-4882-9d47-055b6f30ccf&title=&width=1437)

然后，找到Bootstrap类，运行里面的main方法。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1644757219540-c43cc8fe-5ce7-4643-b0a1-ee6f3fa0e34a.png#clientId=u6ddd513e-43c6-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=373&id=ufadbdc89&margin=%5Bobject%20Object%5D&name=image.png&originHeight=746&originWidth=1636&originalType=binary&ratio=1&rotation=0&showTitle=false&size=131855&status=done&style=none&taskId=ubf55ffe8-dc27-4b1d-9752-6962f07b082&title=&width=818)
### 可能遇到的问题
** 问题一：找不到CookieFileter**
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1644753948317-a571b87e-57d4-4152-9b89-f46851341c76.png#clientId=u6ddd513e-43c6-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=106&id=uda5119b3&margin=%5Bobject%20Object%5D&name=image.png&originHeight=212&originWidth=1686&originalType=binary&ratio=1&rotation=0&showTitle=false&size=44222&status=done&style=none&taskId=u7b308568-2d42-45e6-9d7e-1ac94eb0ce8&title=&width=843)
这是测试文件夹里面的代码，无关紧要，注释TestCookieFilter这个类里面的内容即可

**问题二：控制台乱码。**
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1645363115136-8be105a9-a28b-48d6-89c6-cf65c36d64af.png#clientId=u919e23c1-d19a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=403&id=uaff608ff&margin=%5Bobject%20Object%5D&name=image.png&originHeight=806&originWidth=2440&originalType=binary&ratio=1&rotation=0&showTitle=false&size=303318&status=done&style=none&taskId=ue2d59da2-5090-4bc3-b68b-41dcbf40ae3&title=&width=1220)
首先新增一个UTF8Control类。
```java
package org.apache.tomcat.util.res;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;

public class UTF8Control extends ResourceBundle.Control {
    public ResourceBundle newBundle
    (String baseName, Locale locale, String format, ClassLoader loader, boolean reload) throws IOException {
        // The below is a copy of the default implementation.
        String bundleName = toBundleName(baseName, locale);
        String resourceName = toResourceName(bundleName, "properties");
        ResourceBundle bundle = null;
        InputStream stream = null;
        if (reload) {
            URL url = loader.getResource(resourceName);
            if (url != null) {
                URLConnection connection = url.openConnection();
                if (connection != null) {
                    connection.setUseCaches(false);
                    stream = connection.getInputStream();
                }
            }
        } else {
            stream = loader.getResourceAsStream(resourceName);
        }
        if (stream != null) {
            try {
                // Only this line is changed to make it to read properties files as UTF-8.
                bundle = new PropertyResourceBundle(new InputStreamReader(stream, StandardCharsets.UTF_8));
            } finally {
                stream.close();
            }
        }
        return bundle;
    }
}

```
在`org.apache.tomcat.util.res.StringManger`第83行处添加如下代码：
```java
bnd = ResourceBundle.getBundle(bundleName, locale, new UTF8Control());
```
在`org.apache.tomcat.util.res.StringManger`第92行处添加如下代码：
```java
bnd = ResourceBundle.getBundle(bundleName, locale, cl, new UTF8Control());
```
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1645363437900-75bd326d-309d-432f-a513-e91b98835ec8.png#clientId=u919e23c1-d19a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=419&id=ua4ce2621&margin=%5Bobject%20Object%5D&name=image.png&originHeight=838&originWidth=1958&originalType=binary&ratio=1&rotation=0&showTitle=false&size=205610&status=done&style=none&taskId=u4438bac5-6852-46c8-b093-4cae78c368b&title=&width=979)
在`org.apache.tomcat.util.res.StringManger`的`getString(String, Object...)`这个方法中添加如下代码：
```java
value = new String(value.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
```
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1645364176271-fecc200b-88ae-44a9-92f5-b1e50e0e7e34.png#clientId=u919e23c1-d19a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=287&id=u2ac12bc6&margin=%5Bobject%20Object%5D&name=image.png&originHeight=574&originWidth=1952&originalType=binary&ratio=1&rotation=0&showTitle=false&size=123847&status=done&style=none&taskId=u5c5ff6b9-8d7d-4d62-999c-6b6611d06b0&title=&width=976)
在`org.apache.jasper.compiler.Localizer`的`getMessage(String)`方法中添加如下代码：
```java
errMsg = new String(errMsg.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
```
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1645364282277-b4b3dc53-a1c0-4dad-9732-2b1d5323c41c.png#clientId=u919e23c1-d19a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=283&id=u02100ebe&margin=%5Bobject%20Object%5D&name=image.png&originHeight=566&originWidth=2100&originalType=binary&ratio=1&rotation=0&showTitle=false&size=116096&status=done&style=none&taskId=u51849bb5-16db-4b8f-809f-42a1ea218cf&title=&width=1050)

**问题三：Jsp引擎错误**
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1645365343615-ec724c6f-e907-48d7-86b2-f0d645982a4b.png#clientId=u919e23c1-d19a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=510&id=ud3a0867a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1020&originWidth=1620&originalType=binary&ratio=1&rotation=0&showTitle=false&size=247940&status=done&style=none&taskId=ua55434ba-20a6-4a42-97b4-31774545fe1&title=&width=810)
初始化Jsp引擎，在`org.apache.catalina.startup.ContextConfig`的`configureStart()`方法中（781行），添加如下代码
```java
context.addServletContainerInitializer(new JasperInitializer(), null);
```
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1645364530194-af873002-3532-4bfc-82ab-ca2b2b40bf57.png#clientId=u919e23c1-d19a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=386&id=u1abe1842&margin=%5Bobject%20Object%5D&name=image.png&originHeight=772&originWidth=1796&originalType=binary&ratio=1&rotation=0&showTitle=false&size=159340&status=done&style=none&taskId=u8fd76c56-8298-4821-ac5e-64819214bcc&title=&width=898)

**问题四**
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1645365579610-4bea1be8-90aa-4f40-bf6a-0d11b5daaebb.png#clientId=u919e23c1-d19a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=225&id=u736054c7&margin=%5Bobject%20Object%5D&name=image.png&originHeight=450&originWidth=3164&originalType=binary&ratio=1&rotation=0&showTitle=false&size=283497&status=done&style=none&taskId=u9ee060fe-181f-4fcc-be52-505cb9369cf&title=&width=1582)
修改`source/conf/catalina.properties`中的配置为`*.jar`：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1645365673428-2701d938-ea12-4df5-8f1b-f07d600a8c9d.png#clientId=u919e23c1-d19a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=322&id=udc29f960&margin=%5Bobject%20Object%5D&name=image.png&originHeight=644&originWidth=1366&originalType=binary&ratio=1&rotation=0&showTitle=false&size=100660&status=done&style=none&taskId=u7b88024d-cf97-4e77-8cbf-6f7606665b2&title=&width=683)

**问题五**
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1645365745722-3bcae734-c36e-44c3-8f3e-f5d62f8ff4fc.png#clientId=u919e23c1-d19a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=384&id=u944c3f1e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=768&originWidth=3024&originalType=binary&ratio=1&rotation=0&showTitle=false&size=359866&status=done&style=none&taskId=u8a1adaf9-8c1b-4869-9db8-cb1761f2213&title=&width=1512)
删除`examples`文件夹
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1645365782950-3e6a956d-f259-4d49-8c27-370c4f53bfe0.png#clientId=u919e23c1-d19a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=268&id=ud14ca0e4&margin=%5Bobject%20Object%5D&name=image.png&originHeight=536&originWidth=976&originalType=binary&ratio=1&rotation=0&showTitle=false&size=44722&status=done&style=none&taskId=udf64dd48-5f9b-4523-8a5d-bf6c32e9d1a&title=&width=488)

解决掉所有问题后，控制台出现如下信息，则表示运行正确：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1645365874214-637240fb-cd18-4aaa-8f12-dfe0ef053b80.png#clientId=u919e23c1-d19a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=808&id=u3c1ffdab&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1616&originWidth=3618&originalType=binary&ratio=1&rotation=0&showTitle=false&size=906179&status=done&style=none&taskId=ua79063d0-d09c-4447-89d4-1c36349664c&title=&width=1809)
访问[http://localhost:8080/](http://localhost:8080/)就可以出现如下界面：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1644757334694-88cbfbdd-413c-452f-8737-d5fe45e9db16.png#clientId=u6ddd513e-43c6-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=898&id=u070b8a2d&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1796&originWidth=2010&originalType=binary&ratio=1&rotation=0&showTitle=false&size=681019&status=done&style=none&taskId=uc130a162-4ec9-403f-a062-f864b09fe3b&title=&width=1005)
