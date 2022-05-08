---
title: Explain命令
date: 2022-05-07 20:53:14
categories: 数据库
---
SQL优化思路：
 1. 理清楚SQL组织结构，并初步思考执行过程。
 2. 查看执行计划，得出真实的执行过程，定位瓶颈。
 3. 针对瓶颈进行相应的优化，调整索引等等。
 4. 进一步进行sql语句本身的改造，使用辨识度更高的索引，目标是减少每个步骤的参与查询的数据量。
 5. 改变数据存储形式，减少参与查询的数据规模。

**explain**：在SQL语句前加上该命令，可以看到该SQL语句的具体执行计划

| id | SQL执行的顺序的标识 |
| --- | --- |
| select_type | 每个select子句的类型（SIMPLE、PRIMARY） |
| table | 显示这一行的数据是关于哪张表的 |
| partitions | 
| type | 表示MySQL在表中找到所需行的方式 |
| possible_keys | 指出MySQL能使用哪个索引在表中找到记录 |
| key | key列显示MySQL实际决定使用的键（索引） |
| key_len | 表示索引中使用的字节数 |
| ref | 表示上述表的连接匹配条件，即哪些列或常量被用于查找索引列上的值 |
| rows | 表示MySQL根据表统计信息及索引选用情况，估算的找到所需的记录所需要读取的行数 |
| filtered | 
| Extra | 该列包含MySQL解决查询的详细信息 |

**Type**

1. all：Full Table Scan， MySQL将遍历全表以找到匹配的行
1. index：Full Index Scan，index与ALL区别为index类型只遍历索引树
1. range：只检索给定范围的行，使用一个索引来选择行
1. ref：表示上述表的连接匹配条件，即哪些列或常量被用于查找索引列上的值
1. eq_ref：类似ref，区别就在使用的索引是唯一索引，对于每个索引键值，表中只有一条记录匹配，简单来说，就是多表连接中使用primary key或者 unique key作为关联条件
1. const、system：当MySQL对查询某部分进行优化，并转换为一个常量时，使用这些类型访问。如将主键置于where列表中，MySQL就能将该查询转换为一个常量,system是const类型的特例，当查询的表只有一行的情况下，使用system
1. NULL：MySQL在优化过程中分解语句，执行时甚至不用访问表或索引，例如从一个索引列里选取最小值可以通过单独索引查找完成。

**Extra**

1. Using where：列数据是从仅仅使用了索引中的信息而没有读取实际的行动的表返回的，这发生在对表的全部的请求列都是同一个索引的部分的时候，表示mysql服务器将在存储引擎检索行后再进行过滤
1. Using temporary：表示MySQL需要使用临时表来存储结果集，常见于排序和分组查询
1. Using filesort：MySQL中无法利用索引完成的排序操作称为“文件排序”
1. Using join buffer：改值强调了在获取连接条件时没有使用索引，并且需要连接缓冲区来存储中间结果。如果出现了这个值，那应该注意，根据查询的具体情况可能需要添加索引来改进能。
1. Impossible where：这个值强调了where语句会导致没有符合条件的行。
1. Select tables optimized away：这个值意味着仅通过使用索引，优化器可能仅从聚合函数结果中返回一行
1. (复合索引再使用时，尽量的考虑查询时，常用的排序方向和字段组合顺序)

**select_type**

1. SIMPLE：简单SELECT,不使用UNION或子查询等
1. PRIMARY：查询中若包含任何复杂的子部分,最外层的select被标记为PRIMARY
1. UNION：UNION中的第二个或后面的SELECT语句
1. DEPENDENT ：UNION(UNION中的第二个或后面的SELECT语句，取决于外面的查询
1. UNION RESULT：UNION的结果
1. SUBQUERY：子查询中的第一个SELECT
1. DEPENDENT SUBQUERY：子查询中的第一个SELECT，取决于外面的查询
1. DERIVED：派生表的SELECT, FROM子句的子查询
1. UNCACHEABLE SUBQUERY：一个子查询的结果不能被缓存，必须重新评估外链接的第一行
