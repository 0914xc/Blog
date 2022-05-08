---
title: 常用命令及SQL语句
date: 2022-05-07 20:53:14
categories: 数据库
---
数据库相关
```plsql
# 创建数据库
create database if not exits blog;

-- 删除数据库
drop database if not exits blog;

-- 显示数据库
show databases;

-- 选择创建的数据库
use blog;

-- 显示表名
show tables;

-- 重命名表
alter table articles rename article;

-- 清空数据表
delete from article;

-- 清空数据表，且无法恢复
truncate table article;
```

表相关
```plsql

# 添加列
alter table article add column `author` varchar(5) not null default '' after `title`;
# 修改列名（重建表）
alter table article change author authors;
# 修改列属性（不重建表）
alter table article modify `authors` varchar(10) not null default '' comment '';
# 删除列
alter table article drop authors;


# 插入一行数据
insert into `article` () values ()； 

# 清空表数据，不清空表标识
delete * from article;
```
