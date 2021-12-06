import { VNode, VChildNode } from "./types";
import { flat } from "./utils";

export const createElement = (type: string | Function, props: AnyObject, children?: VChildNode[] | null): VNode => {
  if (typeof type === "function") {
    return {
      type,
      props: {
        ...props,
        children: children ? flat(children) : null,
      },
    };
  }

  return {
    type,
    props,
    children: children ? flat(children) : null,
  };
};
