type AnyObject = Record<string, any>;

type ChildNode = VNode | boolean | string | number | undefined | null;

interface VNode {
  type: string;
  props: AnyObject;
  children?: ChildNode[] | null;
}

const isObject = (data: any)=> typeof data === "object" && data !== null

export const createElement = (type: string, props: AnyObject, children?: ChildNode[]): VNode => {
  function mapChildren(children: ChildNode[]) {
    return children.map((child: ChildNode) => {
      if (isObject(child)) {
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

const isEqual = (a: AnyObject, b: AnyObject): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
}

const diff = (rootElement: HTMLElement & {vDOM?: VNode; html?: HTMLElement}, prev: VNode, current: VNode) => {
  if (prev.type !== current.type) {
    rootElement.html && rootElement.removeChild(rootElement.html);
    renderContent(rootElement, current);
    return;
  }

  if (!isEqual(prev.props, current.props)) {
    for (const k1 in prev.props){
      const currentKeys = Object.keys(current.props);
      if(currentKeys.includes(k1)){
        if(prev.props[k1] !== current.props[k1]){
          const child = rootElement.html;
          child && child.setAttribute(k1, current.props[k1]);
        }
      }else{
        const child = rootElement.html;
        child && child.removeAttribute(k1);
      }
    }

    const newAddedKeys = Object.keys(current.props).filter((v)=> !Object.keys(prev.props).includes(v));
    const child = rootElement.html;

    newAddedKeys.forEach(k=>{
      child && child.setAttribute(k, current.props[k]);
    });
  }

  prev.children?.forEach((v, idx) => {
    if(isObject(v) && current.children && isObject(current.children[idx])){
      diff((rootElement?.html as any), v as VNode, current.children[idx] as VNode)
      return;
    }

    if(current.children && !isObject(current.children[idx])){
      const content = document.createTextNode(current.children[idx] as any);
      (rootElement?.html as any)?.replaceChildren(content);
    }
  })
}


const renderContent = (rootElement:HTMLElement & {vDOM?: VNode; html?: HTMLElement}, content:VNode)=>{
  const element = document.createElement(content.type);

  for (const k in content.props) {
    element.setAttribute(k, content.props[k]);
  }

  content.children?.forEach((v) => {
    if (typeof v === "string") {
      const textNode = document.createTextNode(v);
      element.appendChild(textNode);
    } else {
      renderContent(element, v as VNode);
    }
  })

  rootElement.vDOM = content;
  rootElement.html = element;

  rootElement.appendChild(element)
}

export const render = (rootElement: HTMLElement & {vDOM?: VNode; html?: HTMLElement}, content: VNode) => {
  if (rootElement.vDOM) {
    diff(rootElement, rootElement.vDOM, content);
    return;
  }

  renderContent(rootElement, content);
}
