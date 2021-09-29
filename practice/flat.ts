// 实现 flat

// reduce 版本/循环版本/递归版本

export const flat = (array: unknown[], depth = 1): any[] => {
  const doFlat = (list: unknown[], depth: number = 0) => {
    if (depth <= 0) {
      return list;
    }

    return list.reduce((res: unknown[], item: unknown): any[] => {
      if (Array.isArray(item)) {
        return [...res, ...doFlat(item, depth - 1)];
      }
      return [...res, item];
    }, []);
  };

  return doFlat(array, depth);
};



// [1, [1, 2, [3]]]

// 取出 [1, 2, [3]] -> 发现是 array 并再次入栈 -> stack: [1, 1, 2, [3]]
// 取出 [3]  -> 发现是 array 并再次入栈 -> [1, 1, 2, 3]

// export const flat = (arr: any[]) => {
//   const result = [];
//   const jobList: any[] = [].concat(arr as any);
//
//   while (jobList.length !== 0) {
//     const val = jobList.pop();
//
//     if (Array.isArray(val)) {
//       jobList.push(...val);
//     } else {
//       result.unshift(val);
//     }
//   }
//
//   return result;
// };
