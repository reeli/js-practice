type AnyObject = Record<string, any>;

type ChildFn = (props: AnyObject) => VChildNode;
export type VChildNode = VNode | ChildFn | boolean | string | number | undefined | null;

export interface VNode {
  type: string | Function;
  props: AnyObject;
  children?: VChildNode[] | null;
  html?: HTMLElement
}
