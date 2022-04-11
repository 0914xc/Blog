// 去掉checklist的小圆点
const checkBox = $("input[type=checkbox]");
checkBox.parent().css("list-css", "none");
checkBox.parent().parent().css("padding-left", "0");