// 获取所有的input框
const input = document.getElementsByTagName('input');

for (let i = 0; i < input.length; i++) {
    // 筛选出type为checkbox类型的input
    if (input[i].type === 'checkbox') {
        // 去掉checkbox前的小圆点，并纠正其位置
        input[i].style.cssText += 'margin-right: 10px;'
        input[i].parentElement.style.cssText += 'list-style: none; margin-left: -30px'
    }
}
