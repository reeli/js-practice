import express from "express";

const app = express();

new Promise((resolve) => {
  resolve(123);
}).then((v) => {
  console.log(v, "on Promise1");
});

new Promise((resolve) => {
  resolve(456);
}).then((v) => {
  console.log(v, "on Promise2");
});

new Promise((resolve) => {
  resolve(789);
}).then((v) => {
  console.log(v, "on Promise3");
});

const cal = async ()=>{
 return new Array(100000).fill("").map((_, v)=>v+1).join("")
}


app.get("/promise", async (req, res) => {
  setTimeout(()=>{
    new Array(100000).fill("").map((_, v)=>v+1).join("")
  }, 0)
  res.send("hello world");
});

app.get("/direct", (req, res) => {
  new Array(100000).fill("").map((_, v)=>v+1).join("")
  res.send("hello world");
});


app.get("/empty", (req, res) => {
  res.send("hello world");
});


setTimeout(() => {
  console.log("on timeout");
}, 1000);

app.listen(8081, () => {
  console.log("Listen on port 8081...");
});
