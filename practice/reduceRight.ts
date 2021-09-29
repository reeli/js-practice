// 实现 reduceRight

export function reduceRight(arr: any[], fn: (prev: any, item: any) => any, defaultVal: any) {
  let prev = defaultVal;

  for (let i = arr.length - 1; i >= 0; i--) {
    prev = fn(prev, arr[i]);
  }

  return prev;
}
