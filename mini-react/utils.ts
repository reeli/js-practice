export const isObject = (data: any) => typeof data === "object" && data !== null

export const flat = (data: any[]): any[] => {
  return data.reduce((res, item) => {
    if (Array.isArray(item)) {
      return [
        ...res,
        ...flat(item)
      ]
    }

    return [...res, item];
  }, [])
}

export const isEqual = (a?: any, b?: any): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
}
