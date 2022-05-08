---
title: Git常用命令
date: 2022-05-07 20:53:13
categories: Git
---

1. stash 暂存代码、保持工作区干净
```bash
# 保存当前未commit的代码
git stash

# 保存当前未commit的代码并添加备注
git stash save "备注的内容"

# 列出stash的所有记录
git stash list

# 删除stash的所有记录
git stash clear

# 应用最近一次的stash
git stash apply

# 应用最近一次的stash，随后删除该记录
git stash pop

# 删除最近的一次stash
git stash drop
```

2. reset
```bash
git reset --hard
```
