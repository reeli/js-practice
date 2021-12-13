const fs = require("fs");
const path = require("path");

function loadWebAssembly(url) {
  const source = fs.readFileSync(path.resolve(process.cwd(), url));

  // 开辟共享内存空间
  const sharedBuffer = new SharedArrayBuffer(source.length);

  const typedArray = new Uint8Array(sharedBuffer);
  // 将源码写入上面的共享内存空间
  for (let i = 0; i < source.length; i++) {
    typedArray[i] = source[i];
  }

  // 传入 sharedBuffer 到 worker  读
  // const typedArray = new Uint8Array(sharedBuffer);

  return sharedBuffer;
}

const sharedBuffer = loadWebAssembly("./node/program.wasm");
module.exports = sharedBuffer;

// const enc = new TextEncoder();
// const buffer = enc.encode(JSON.stringify(wasmData));
// console.log(buffer, "array buffer");
