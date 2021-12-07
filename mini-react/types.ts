export type VChildNode = VNode | boolean | string | number | undefined | null;
export interface VNode {
  type: string | Function;
  props: {
    [key: string]: any;
    children: VChildNode[] | null;
  };
  output?: VNode[]; // output: type(props)
  html?: HTMLElement;
}
