import { flat } from "./utils";
import { VChildNode, VNode } from "./types";

export const createElement = (
  type: string | Function,
  props: AnyObject = {},
  children: VChildNode[] | null,
) => {
  return {
    type,
    props: {
      ...props,
      children: children ? flat(children) : null,
    },
  };
};

export const createTextVNode = (text: string | number): VNode => {
  return {
    type: "textNode",
    props: {
      content: text,
    },
  };
};
