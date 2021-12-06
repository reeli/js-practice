type AnyObject = Record<string, any>;

type ChildFn = (props: AnyObject) => ChildNode;
type ChildNode = VNode | ChildFn | boolean | string | number | undefined | null;

interface VNode {
  type: string | Function;
  props: AnyObject;
  children?: ChildNode[] | null;
  html?: HTMLElement
}

const isObject = (data: any) => typeof data === "object" && data !== null

export const flat = (data: any[]): any[] => {
  return data.reduce((res, item) => {
    if (Array.isArray(item)) {
      return [
        ...res,
        ...flat(item)
      ]
    }

    return [...res, item];
  }, [])
}

export const createElement = (type: string | Function, props: AnyObject, children?: ChildNode[]): VNode => {
  if (typeof type === "function") {
    return {
      type,
      props: {
        ...props,
        children: children ? mapChildren(children) as ChildNode[] : null
      }
    }
  }

  function mapChildren(children: ChildNode[]): any[] {
    const res = children.map((child: ChildNode) => {
      if (Array.isArray(child)) {
        return mapChildren(child);
      }
      if (isObject(child)) {
        return child;
      }

      return String(child);
    });
    return flat(res);
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

const diffChildren = (prev: VNode, current: VNode) => {
  prev.children?.forEach((v, idx) => {
    const prevChild = (v as VNode);
    const currentChild = current.children ? (current.children[idx] as VNode) : null;

    if (currentChild && isObject(prevChild) && isObject(currentChild)) {
      diff(prev?.html!, prevChild, currentChild);
      return;
    }

    if (currentChild && !isObject(currentChild)) {
      const content = document.createTextNode(currentChild as any);
      prev.html?.replaceChildren(content);
    }
  })
}

const typeDiff = (parentEl: HTMLElement, prev: VNode, current: VNode) => {
  diff(parentEl, null, current, prev.html);
  prev.html && prev.html.remove();
  return;
}

const propsDiff = (prev: VNode, current: VNode) => {
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

const createEl = (parentEl: HTMLElement, current: VNode, beforeEl?: HTMLElement) => {
  const element = document.createElement(current.type as string);
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

  parentEl.insertBefore(element, beforeEl || null)
}

const diff = (parentEl: HTMLElement, prev: VNode | null, current: VNode, beforeEl?: HTMLElement) => {
  if (!prev) {
    if (typeof current.type === "function") {
      createEl(parentEl, current.type(current.props), beforeEl)
      return;
    }

    createEl(parentEl, current, beforeEl);
    return;
  }

  if (prev.type !== current.type) {
    typeDiff(parentEl, prev, current);
    return;
  }

  if (!isEqual(prev.props, current.props)) {
    propsDiff(prev, current)
  }

  if (!isEqual(prev.children, current.children)) {
    diffChildren(prev, current);
  }
}

export const render = (parentEl: HTMLElement & { vDOM?: VNode; }, vNode: VNode) => {
  diff(parentEl, parentEl.vDOM || null, vNode)
  parentEl.vDOM = vNode;
}
