// 实现 safe stringify

var b = {
  b1: "b1",
};

var a = {
  a1: "a1",
  a2: "a2",
};

b.a = a;
a.b = b;

function isObj(data) {
  return typeof data === "object" && !Array.isArray(data) && data !== null;
}

export const safeStringify = (data) => {
  const objList = [];

  const checkCircular = (input) => {
    if(objList.includes(data)){
      return "<circular>"
    }

    if (isObj(data)) {
      objList.push(data);
    }

    return Object.keys(input).map((k) => {
      if (isObj(input[k])) {
        objList.push(input[k]);
        return `"${k}":"${checkCircular(input[k])}"`
      }
      return `"${k}":"${input[k]}",`
    }).join("");
  };

  return `{${checkCircular(data)}}`;
};

const aStr = safeStringify(a);
console.log(aStr);
