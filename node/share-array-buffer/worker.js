const { parentPort, workerData } = require("worker_threads");

function calc() {
  const typedArray = new Uint8Array(workerData);

  return WebAssembly.instantiate(typedArray, {})
    .then((obj) => {
      console.log("obj.instance.exports:", obj.instance.exports);
      return obj.instance.exports.main();
    })
    .catch();
}

calc().then((v) => {
  parentPort.postMessage(v);
  parentPort.close();
});
