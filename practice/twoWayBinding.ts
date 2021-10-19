const obj = {
  a: 1,
  b: 2
}

Object.defineProperty(obj, "a", {
  enumerable: true,
  configurable:true,
  get: () => {
    console.log("get me");
  },
  set: (newValue: number) => {
    console.log("set ", newValue)
  }
})

obj.a = 123
