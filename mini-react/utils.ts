import { VNode, ComponentVNode, TextVNode } from "./types";

export const isObject = (data: any) =>
  typeof data === "object" && data !== null;

export const flat = (data: any[]): any[] => {
  return data.reduce((res, item) => {
    if (Array.isArray(item)) {
      return [...res, ...flat(item)];
    }

    return [...res, item];
  }, []);
};

export const isEqual = (a?: any, b?: any): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export const isComponentVNode = (vNode: VNode): vNode is ComponentVNode =>
  typeof vNode.type === "function";

export const isTextNode = (vNode: VNode): vNode is TextVNode =>
  vNode.type === "textNode";

export const isVNode = isObject;

export const omit = (obj: AnyObject, key: string): AnyObject =>
  Object.keys(obj)
    .filter((v) => v !== key)
    .reduce((res, k) => {
      return {
        ...res,
        [k]: obj[k],
      };
    }, {});
