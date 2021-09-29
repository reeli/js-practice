// 用 setTimeout 实现 setInterval
// https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/259

const setInterval = (fn, time) => {
  let timerId;

  const loop = () => {
    if (timerId) {
      clearTimeout(timerId)
    }

    timerId = setTimeout(() => {
      fn();
      loop();
    }, time)
  }

  loop();

  return {
    clear: ()=>{
      clearTimeout(timerId)
    }
  };
}

const clearInterval = (timer) => {
  timer.clear();
}


const timer = setInterval(() => {
  console.log("test")
}, 1000);


setTimeout(()=>{
  clearInterval(timer)
}, 3000)
