const cal = async () => {
  return Promise.all(new Array(50000).fill("").map(async (_, idx) => {
    return await new Promise((resolve) => {
      resolve(idx);
    })
  }));
};

const a= await cal();

console.log((a));
