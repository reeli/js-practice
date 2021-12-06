import { VNode } from "./types";

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

type ComponentVNode = Omit<VNode, "type"> & { type: Function };
export const isComponentVNode = (vNode: VNode): vNode is ComponentVNode =>
  typeof vNode.type === "function";
