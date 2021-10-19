type Resolve = (value: any) => any;
type Reject = (reason: any) => any;

type PromiseCallback = (resolve: Resolve, reject: Reject) => void;

enum PromiseStatus {
  pending = "pending",
  fulfilled = "fulfilled",
  rejected = "rejected"
}

type Reason = any;
type Value = any;
type FullFilledCallback = (value: Value, ...args: any[]) => any;
type RejectedCallback = (reason: Reason, ...args: any[]) => any;

class MyPromise {
  status: PromiseStatus = PromiseStatus.pending;
  reason: Reason;
  value: Value;
  fullFilledCallbacks: FullFilledCallback[] = []
  rejectedCallbacks: RejectedCallback[] = []

  constructor(cb?: PromiseCallback) {
    if (cb) {
      this.status = PromiseStatus.pending;
      cb(this.resolve, this.reject)
    }
  }

  resolve = (value: any) => {
    if (this.status !== PromiseStatus.fulfilled) {
      this.status = PromiseStatus.fulfilled;
      this.fullFilledCallbacks.reduce((a, b) => {
        try {
          return b(a(value))
        } catch (err) {
          return this.reject(err)
        }
      })
    }
  }

  reject = (reason: any) => {
    if (this.status !== PromiseStatus.rejected) {
      this.status = PromiseStatus.rejected;

      this.rejectedCallbacks.forEach((a) => {
        a(reason)
      })
    }
  }

  then = (onFulfilled?: (value: Value, ...args: any[]) => any, onRejected?: (arg: Reason, ...args: any[]) => any) => {
    if (typeof onFulfilled === "function") {
      this.fullFilledCallbacks = [
        ...this.fullFilledCallbacks,
        onFulfilled
      ]
    }

    if (typeof onRejected === "function") {
      this.rejectedCallbacks = [
        ...this.rejectedCallbacks,
        onRejected
      ]
    }

    return this;
  }

  catch = (_: any) => {
    return this;
  }
}

new MyPromise((resolve) => {
  setTimeout(() => {
    resolve(1)
  }, 0)
}).then(value => {
  console.log(value)
  throw new Error("test")
}).then(value => {
  console.log(value, "value")
}, (err) => {
  console.log("rejected1", err)
})

// new Promise((resolve) => {
//   setTimeout(() => {
//     resolve(1)
//   }, 0)
// }).then(value => {
//   console.log(value)
// }).then(value => {
//   console.log(value)
// })
