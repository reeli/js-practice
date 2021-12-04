type AnyObject = Record<string, any>;

type ChildNode = VNode | boolean | string | number | undefined | null;

interface VNode {
  type: string;
  props: AnyObject;
  children?: ChildNode[] | null;
  html?: HTMLElement
}

const isObject = (data: any) => typeof data === "object" && data !== null

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

const isEqual = (a?: any, b?: any): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
}

const diffChildren = (rootElement: HTMLElement & { vDOM?: VNode; }, prev: VNode, current: VNode) => {
  prev.children?.forEach((v, idx) => {
    const prevChild = (v as VNode);
    const currentChild = current.children ? (current.children[idx] as VNode) : null;

    if (currentChild && isObject(prevChild) && isObject(currentChild)) {
      diff(rootElement, prevChild, currentChild);
      return;
    }

    if (currentChild && !isObject(currentChild)) {
      const content = document.createTextNode(currentChild as any);
      prev.html?.replaceChildren(content);
    }
  })
}

const typeDiff = (rootElement: HTMLElement & { vDOM?: VNode; }, prev: VNode, current: VNode) => {
  prev.html && prev.html.remove();
  diff(rootElement, null, current);
  return;
}

const propsDiff = (_: HTMLElement & { vDOM?: VNode }, prev: VNode, current: VNode) => {
  for (const k in prev.props) {
    const currentKeys = Object.keys(current.props);
    if (currentKeys.includes(k)) {
      prev.html && prev.props[k] !== current.props[k] && prev.html.setAttribute(k, current.props[k]);
    } else {
      prev.html && prev.html.removeAttribute(k);
    }
  }

  const newAddedKeys = Object.keys(current.props).filter((v) => !Object.keys(prev.props).includes(v));
  newAddedKeys.forEach(k => {
    prev.html && prev.html.setAttribute(k, current.props[k]);
  });
}

const diff = (rootElement: HTMLElement & { vDOM?: VNode; }, prev: VNode | null, current: VNode) => {
  if (!prev) {
    const element = document.createElement(current.type);
    current.html = element;

    for (const k in current.props) {
      element.setAttribute(k, current.props[k]);
    }

    current.children?.forEach((v) => {
      if (isObject(v)) {
        diff(element, null, v as VNode)
        return;
      }

      const textNode = document.createTextNode(v as string);
      element.appendChild(textNode);
    })

    rootElement.appendChild(element)
    return;
  }

  if (prev.type !== current.type) {
    typeDiff(rootElement, prev, current);
    return;
  }

  if (!isEqual(prev.props, current.props)) {
    propsDiff(rootElement, prev, current)
  }

  if (!isEqual(prev.children, current.children)) {
    diffChildren(rootElement, prev, current);
  }
}

export const render = (parentEl: HTMLElement & { vDOM?: VNode; }, vNode: VNode) => {
  diff(parentEl, parentEl.vDOM || null, vNode)
  parentEl.vDOM = vNode;
}
