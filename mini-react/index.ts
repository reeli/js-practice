type AnyObject = Record<string, any>;

type ChildNode = VNode | boolean | string | number | undefined | null;

interface VNode {
  type: string;
  props: AnyObject;
  children?: ChildNode[] | null;
}


export const createElement = (type: string, props: AnyObject, children?: ChildNode[]): VNode => {
  function mapChildren(children: ChildNode[]) {
    return children.map((child: ChildNode)=>{
      if (typeof child === "object" && child !== null) {
        return child;
      }

      return String(child);
    })
  }

  return {
    type,
    props,
    children: children ? mapChildren(children) as ChildNode[] : null
  }
}

export const render = (rootElement: HTMLElement, content: VNode) => {
  const element = document.createElement(content.type);

  for (const k in content.props) {
    element.setAttribute(k, content.props[k]);
  }


  content.children?.forEach(v=>{
    if(typeof v==="string"){
      const textNode = document.createTextNode(v);
      element.appendChild(textNode);
    }
  })

  rootElement.appendChild(element)
}
