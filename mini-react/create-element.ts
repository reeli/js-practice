import { flat } from "./utils";
import { VChildNode } from "./types";

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
