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

// 顶部元素，取HTML
const Top = document.getElementsByTagName('html')[0];

// 回到顶部按钮
const backTop = document.getElementById('backTop');

// 回到顶部
backTop.addEventListener('click', function(e) {
    Top.scrollIntoView({  behavior: 'smooth'})
})

// 控制回到顶部按钮的显示与隐藏
window.onscroll = function () {
    if (document.documentElement.scrollTop + document.body.scrollTop > 800) {
        backTop.style.visibility = "visible";
    } else {
        backTop.style.visibility = "hidden";
    }
}