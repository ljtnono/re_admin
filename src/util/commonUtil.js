class CommonUtil {

  // 防抖函数的作用就是控制函数在一定时间内的执行次数。防抖意味着 N 秒内函数只会被执行一次（最后一次），如果 N 秒内再次被触发，则重新计算延迟时间。
  // 节流函数的作用是规定一个单位时间，在这个单位时间内最多只能触发一次函数执行，如果这个单位时间内多次触发函数，只能有一次生效。
  // 防抖
  static debounce(fn, delay) {
    delay = delay || 200;
    let timer;
    return function () {
      let th = this;
      let args = arguments;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        timer = null;
        fn.apply(th, args);
      }, delay);
    };
  }

  // 节流
  static throttle(fn, interval) {
    let last;
    let timer;
    interval = interval || 200;
    return function () {
      let th = this;
      let args = arguments;
      let now = +new Date();
      if (last && now - last < interval) {
        clearTimeout(timer);
        timer = setTimeout(function () {
          last = now;
          fn.apply(th, args);
        }, interval);
      } else {
        last = now;
        fn.apply(th, args);
      }
    }
  }
}

export default CommonUtil;
