// 1. 定义 Promise 的状态(三种)，定义用来存储成功的 callback 函数和 失败的 callback 函数
// 2. 定义 Promise 包含的实例方法：resolve, reject, then

type Resolve<T> = (value: T) => any;
type Reject = (reason: string) => any;

enum Status {
  Pending = "Pending",
  Fulfilled = "Fulfilled",
  Rejected = "Rejected"
}

type OnFulFilled<T> = (value: T|undefined) => any;
type OnRejected = (reason: string) => any;

export class MyPromise<TValue> {
  value: TValue|undefined = undefined;
  status: Status
  fulfilledCallbacks: OnFulFilled<TValue>[] = [];
  rejectedCallbacks: OnRejected[] = [];

  constructor(fn: (resolve: Resolve<TValue>, reject: Reject) => any) {
    this.status = Status.Pending;
    fn(this.resolve, this.reject);
  }

  resolve = (value: TValue) => {
    setTimeout(()=>{
      if (this.status === Status.Pending) {
        this.status = Status.Fulfilled;
        this.value = value;

        this.fulfilledCallbacks.forEach(cb => {
          this.value = cb(this.value);
        });
      }
    }, 0)
  }

  reject = (reason: string) => {
    setTimeout(()=>{
      if (this.status === Status.Pending) {
        this.status = Status.Rejected;

        this.rejectedCallbacks.forEach((cb) => {
          cb(reason)
        });
      }
    },0)
  }

  then = (onFulfilled?: OnFulFilled<TValue>, onRejected?: OnRejected) => {
    const onFulfilledCallback = typeof onFulfilled === "function" ? onFulfilled : () => {
    };
    const onRejectedCallback = typeof onRejected === "function" ? onRejected : () => {
    };

    this.fulfilledCallbacks.push(onFulfilledCallback);
    this.rejectedCallbacks.push(onRejectedCallback);

    return this;
  }

  catch = ()=>{

  }
}

new MyPromise<string>((resolve, reject) => {
  // setTimeout(() => {
  //   resolve("hello")
  // }, 400)
  resolve("hello");
  reject("error")
}).then((data) => {
  console.log(data, "resolved");
  return data + "123";
}, (data)=>{
  console.log(data, "rejected")
})
