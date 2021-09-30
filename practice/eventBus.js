// 实现 EventBus

class EventBus {
  constructor() {
    this.events = {};
  }

  // 建立事件监听
  on(eventName, callback) {
    this.events[eventName] = [...(this.events[eventName] || []), callback];
  }


  // 移除事件监听
  off(eventName, callback) {
    this.events[eventName] = this.events[eventName].filter(cb => cb !== callback)
  }

  // trigger 事件
  emit(eventName, ...arg) {
    this.events[eventName].forEach((cb) => {
      cb(...arg);
    });
  }
}

const eventBus = new EventBus();

const sayHi = (msg) => {
  console.log(msg)
};

eventBus.on("sayHi", sayHi);

const sayHiWithComment = (msg) => {
  console.log(msg + "hello")
};

eventBus.on("sayHi", sayHiWithComment);

eventBus.emit('sayHi', Math.random().toFixed(2))

eventBus.off("sayHi", sayHi);

eventBus.emit('sayHi', "wawa")

