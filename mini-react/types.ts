export type AnyObject = Record<string, any>;
export type VChildNode = VNode | boolean | string | number | undefined | null;
export interface VNode {
  type: string | Function;
  props: AnyObject | null;
  children: VChildNode[] | null;
  html?: HTMLElement;
}
