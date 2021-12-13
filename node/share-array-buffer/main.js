const path = require("path");
const { Worker } = require("worker_threads");
const sharedBuffer = require("./wasm-demo");

const workerPath = path.resolve(__dirname + "/worker.js");

const main = () => {
  [1, 2, 3, 4, 5].map((segment) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(workerPath, {
        workerData: sharedBuffer,
      });

      worker.on("message", resolve);
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  });
};

main();
