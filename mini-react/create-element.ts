import {VNode, VChildNode} from "./types";
import {isObject, flat} from "./utils";

export const createElement = (type: string | Function, props: AnyObject, children?: VChildNode[]|null): VNode => {
  if (typeof type === "function") {
    return {
      type,
      props: {
        ...props,
        children: children ? mapChildren(children) as VChildNode[] : null
      }
    }
  }

  function mapChildren(children: VChildNode[]): VChildNode[] {
    const res = children.map((child: VChildNode) => {
      if (Array.isArray(child)) {
        return mapChildren(child);
      }

      if (isObject(child)) {
        return child;
      }
// <Foo>{false}</Foo> => <div>false</div>
      return String(child);
    });

    return flat(res);
  }

  return {
    type,
    props,
    children: children ? mapChildren(children) : null
  }
}
