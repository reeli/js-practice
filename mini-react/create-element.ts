import { flat } from "./utils";
import { VChildNode } from "./types";

export const createElement = (type: string | Function, props: AnyObject | null, children: VChildNode[] | null) => {
  if (typeof type === "function") {
    return {
      type,
      props: {
        ...props,
        children: children ? flat(children) : null,
      },
      children: null,
    };
  }

  return {
    type,
    props,
    children: children ? flat(children) : null,
  };
};
