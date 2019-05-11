
/**
 * 防抖函数
 * @param {*} func 
 * @param {*} wait 
 */
export function debounce(func, wait = 500) {
    let timeout;  // 定时器变量
    return function (event) {
        clearTimeout(timeout);  // 每次触发时先清除上一次的定时器,然后重新计时
        event.persist && event.persist()   //保留对事件的引用
        timeout = setTimeout(() => {
            func(event)
        }, wait);  // 指定 xx ms 后触发真正想进行的操作 handler
    };
}

/**
 * 节流函数
 * @param {*} func 
 * @param {*} interval 
 */
export function throttle(func, interval = 100) {
    let timeout;
    let startTime = new Date();
    return function (event) {
        event.persist && event.persist()   //保留对事件的引用
        clearTimeout(timeout);
        let curTime = new Date();
        if (curTime - startTime <= interval) {
            //小于规定时间间隔时，用setTimeout在指定时间后再执行
            timeout = setTimeout(() => {
                func(event);
            }, interval)
        } else {
            //重新计时并执行函数
            startTime = curTime;
            func(event)
        }
    }
}