// 实现大数相加/大数相乘

const a = "9999999999999";
const b = "888111111111111123123";

const bigNumberPlus = (a, b) => {
  let listA = a.split("").reverse();
  let listB = b.split("").reverse();

  if (listB.length > listA.length) {
    const temp = listB;
    listB = listA;
    listA = temp;
  }

  const res = [];
  let temp = 0;

  listA.forEach((numA, idx) => {
    const total = Number(numA) + Number(listB[idx] || 0) + temp;
    if (total > 9) {
      temp = 1;
      res.unshift(total - 10);
    } else {
      res.unshift(total);
      temp = 0;
    }
  });

  return temp > 0 ? [temp, ...res].join("") : res.join("");
};

const num =bigNumberPlus(a, b);

console.log(new Intl.NumberFormat().format(num))
