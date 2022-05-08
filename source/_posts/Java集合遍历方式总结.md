---
title: Java集合遍历方式总结
date: 2022-05-07 20:52:57
categories: Java
---

Collection遍历：判断List集合中是否包含字符串“C”

第一种：普通For循环遍历

```Java
for (int i = 0; i < items.size(); i++) {
    if ("C".equals(items.get(i))) {
        System.out.println(items.get(i));
    }
}
```

第二种：增强For循环遍历
```Java
for (String item : items) {
    if ("C".equals(item)) {
        System.out.println(item);
    }
}
```

第三种：Lambda 表达式
```Java
items.forEach(item -> {
    if ("C".equals(item)) {
        System.out.println(item);
    }
});
```

第四种：stream
```Java
items.stream().filter(s -> s.equals("C")).forEach(System.out::println);
```
