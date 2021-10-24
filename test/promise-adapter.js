const {MyPromise} = require("../.output/practice/promise");

module.exports = {
  deferred: () => {
    let resolve;
    let reject;

    const promise = new MyPromise((resolveFn, rejectFn) => {
      resolve = resolveFn;
      reject = rejectFn;
    })

    return ({
      promise,
      resolve,
      reject
    })
  }
};

