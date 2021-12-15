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
    this.events[eventName] = this.events[eventName].filter(
      (cb) => cb !== callback,
    );
  }

  // trigger 事件
  emit(eventName, ...arg) {
    this.events[eventName].forEach((cb) => {
      cb(...arg);
    });
  }
}

// const eventBus = new EventBus();

const sayHi = (msg) => {
  console.log(msg);
};
//
// eventBus.on("sayHi", sayHi);
//
// const sayHiWithComment = (msg) => {
//   console.log(msg + "hello");
// };
//
// eventBus.on("sayHi", sayHiWithComment);
//
// eventBus.emit("sayHi", Math.random().toFixed(2));
//
// eventBus.off("sayHi", sayHi);
//
// eventBus.emit("sayHi", "wawa");

// ===================================================

var eventBus2 = new EventBus();

// var eventBus2 = new EventBus();

const bind = (cb) => {
  eventBus2.on("sayHi", () => cb());
};

bind(() => console.log(1));
console.log("after first bind");

console.log("before emit");
eventBus2.emit("sayHi", Math.random().toFixed(2));

// 再一次 bind() 之后 callback 并没有 trigger 当前的 callback，而是前一次的 callback，因为 emit 在第二次 bind 之前执行了
bind(() => console.log(2));
console.log("after second bind");
