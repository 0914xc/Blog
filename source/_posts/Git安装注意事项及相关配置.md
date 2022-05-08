---
title: Git安装注意事项及相关配置
date: 2022-05-07 20:53:12
categories: Git
---
1. 大文件支持和中文正常显示

![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1645429836040-8d2faed8-b347-4cbe-8b83-67e4d8188f08.png#clientId=u27aa3a25-82cc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=387&id=u06814783&margin=%5Bobject%20Object%5D&name=image.png&originHeight=387&originWidth=498&originalType=binary&ratio=1&rotation=0&showTitle=false&size=25542&status=done&style=none&taskId=u17866ba6-1aac-4f3c-aeb1-2ed1d0c6a80&title=&width=498)

2. 这里选择第二个选项。这样 Git 就可以在 **cmd、powershell、IDE** 的集成终端等多处地方使用了。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1643962715502-4864f2db-46af-4bb6-83f8-116f5c939ab5.png#clientId=u7978df8a-90e3-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=379&id=u551c9d7a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=564&originWidth=748&originalType=url&ratio=1&rotation=0&showTitle=false&size=54279&status=done&style=none&taskId=u7b5dc141-9029-4e73-94db-b0f469e773f&title=&width=502)

3. 在行尾设置时，我们选择第三项。即 **checkout 和 commit 时不改变行尾**，否则自动的行尾更改可能会导致代码风格检查工具的大量报错（上传时被改为Unix，下载时被改为Windows）。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/1008459/1643962810857-5ac96b15-ce6e-449d-8dcb-b42065fac562.png#clientId=u7978df8a-90e3-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=388&id=ufa9cf820&margin=%5Bobject%20Object%5D&name=image.png&originHeight=564&originWidth=748&originalType=url&ratio=1&rotation=0&showTitle=false&size=53523&status=done&style=none&taskId=u52cac9a7-fd77-44ff-b445-0a3db26ed52&title=&width=515)

4. 创建密钥（存放到Github官网的是公钥）
```bash
ssh-keygen -t rsa -C "weixiaochen0914@qq.com"
```

5. 配置参数
```bash
# 查看全局配置
git config --global --list

#配置用户名
git config --global user.name = "0914xc"

#配置邮箱
git config --global user.email "weixiaochen0914@qq.com"
```
