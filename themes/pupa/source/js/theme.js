// 隐藏checklist的小圆点
const checkBox = $("input[type=checkbox]");
checkBox.parent().css("list-css", "none");
checkBox.parent().parent().css("padding-left", "0");

// 获取所有的描点元素
function getAllAnchorElement() {
    return document.documentElement.querySelectorAll("a");
}

// 高亮描点元素
function highlightAnchorElement(anchorElement) {
    getAllAnchorElement().forEach(element => {
        element.classList.remove('highlight')
        if (element.hash.slice(1) === anchorElement) {
            element.classList.add('highlight')
        }
    })
}

// 滚动条距离顶端值
function getScrollTop() {
    return document.documentElement.scrollTop || document.body.scrollTop;
}

function handScroll() {
    // 需要高亮的描点元素
    let anchorElement;

    getAllAnchorElement().forEach(element => {
        const anchor = element.hash.slice(1);
        if (anchor) {
            const elementTop = document.getElementById(anchor).getBoundingClientRect().top;
            // 高亮离顶部近的元素
            if (elementTop <= 100) {
                anchorElement = anchor;
            }
        }
    })

    if (anchorElement) {
        highlightAnchorElement(anchorElement);
    }
}


function throttle() {
    let lastTime = 0;
    return function (callback, delay) {
        let now = new Date().getTime();
        if (now - lastTime > delay) {
            callback();
            lastTime = now;
        }
    }
}

let last_known_scroll_position = 0;
let ticking = false;

function doSomething(scroll_pos) {
    // 根据滚动位置做的事
    handScroll();
}

window.addEventListener('scroll', function (e) {
    last_known_scroll_position = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(function () {
            doSomething(last_known_scroll_position);
            ticking = false;
        });

        ticking = true;
    }
});