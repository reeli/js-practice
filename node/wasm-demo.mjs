import fs from "fs";
import path from "path";

function loadWebAssembly(url) {
  const source = fs.readFileSync(path.resolve(process.cwd(), url));
  const typedArray = new Uint8Array(source);

  return WebAssembly.instantiate(typedArray, {})
    .then((obj) => {
      console.log("obj.instance.exports:", obj.instance.exports);
      return obj.instance.exports;
    })
    .catch();
}

export const wasmData = await loadWebAssembly("./node/program.wasm");
console.log(wasmData.main());

// const enc = new TextEncoder();
// const buffer = enc.encode(JSON.stringify(wasmData));
// console.log(buffer, "array buffer");
