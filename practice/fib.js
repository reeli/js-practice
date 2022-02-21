// 参考：https://www.cnblogs.com/andy-songwei/p/11707142.html

// 1. 递归版
function fib(num) {
  if (num === 0) {
    return 0;
  }

  if (num === 1) {
    return 1;
  }

  return fib(num - 1) + fib(num - 2);
}

// 2. 递归 + Map 去掉重复计算
const map = {};

function fib(num) {
  if (num === 0) {
    map[num] = 0;
    return 0;
  }

  if (num === 1) {
    map[num] = 1;
    return 1;
  }

  if (map[num]) {
    return map[num];
  }

  map[num] = fib(num - 1) + fib(num - 2);

  return map[num];
}

// 3. 循环 + 数组
function fib(num) {
  const arr = new Array(num).fill(undefined);
  arr[0] = 0;
  arr[1] = 1;

  for (let i = 2; i <= num; i++) {
    arr[i] = arr[i - 2] + arr[i - 1];
  }

  return arr[num];
}

// 4. 循环 + 三值滚动计算法
function fib(num) {
  if (num === 0) {
    return 0;
  }
  if (num === 1) {
    return 1;
  }

  let first = 0;
  let second = 0;
  let sum = 1;

  for (let i = 1; i <= num; i++) {
    sum = first + second;
    first = second;
    second = sum;
  }

  return sum;
}
