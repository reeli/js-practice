import { VNode } from "./types";
import { isEqual, isFunction, isVNode } from "./utils";
import { createTextVNode } from "./create-element";

const diff = (parentEl: HTMLElement, prev: VNode | null, current: VNode) => {
  if (!prev) {
    return create(parentEl, current);
  }

  if (isFunction(current) && current.props.children) {
    setChildren(current, current.props.children);
    return;
  }

  if (prev.type === current.type && isEqual(prev.props, current.props)) {
    return;
  }

  current._html = prev._html;

  if (prev.type !== current.type) {
    create(current._html || parentEl, current);
    return;
  }

  const { children: prevChildren, ...prevProps } = prev.props;
  const { children: currentChildren, ...currentProps } = current.props;

  if ((prevProps || currentProps) && !isEqual(prevProps, currentProps)) {
    diffProps(current._html || parentEl, prevProps, currentProps);
  }

  if (
    (prev._children || current._children) &&
    !isEqual(prev._children, current._children)
  ) {
    diffChildren(current._html || parentEl, prev._children, current._children);
  }
};

const setChildren = (vNode: VNode, children: any[]) => {
  children.forEach((child) => {
    if (typeof child === "string" || typeof child === "number") {
      const textNode = createTextVNode(child);
      vNode._children = [...(vNode._children || []), textNode];
    }

    if (isVNode(child)) {
      vNode._children = [...(vNode._children || []), child];
    }
  });
};

const diffProps = (
  el: HTMLElement,
  prevProps: VNode["props"],
  currentProps: VNode["props"],
) => {
  const prevKeys = Object.keys(prevProps);
  const currentKeys = Object.keys(currentProps);

  currentKeys.forEach((k) => {
    if (prevKeys.includes(k) && currentProps[k] === prevProps[k]) {
      return;
    }

    el.setAttribute(k, currentProps[k]);
  });

  prevKeys.forEach((k) => {
    if (!currentKeys.includes(k)) {
      el.removeAttribute(k);
    }
  });
};

const diffChildren = (
  el: HTMLElement,
  prevChildren: VNode["_children"],
  currentChildren: VNode["_children"],
) => {
  currentChildren?.forEach((currentChild, idx) => {
    const prevChild = prevChildren ? prevChildren[idx] : null;
    diff(el, prevChild, currentChild);
  });
};

const create = (parentEl: HTMLElement, vNode: VNode) => {
  if (typeof vNode.type === "function") {
    const _children = vNode.type(vNode.props);
    vNode._children = [_children];

    create(parentEl, _children);

    return;
  }

  if (vNode.type === "textNode") {
    parentEl.textContent = vNode.props.content;
    return;
  }

  const element = document.createElement(vNode.type);
  const { children, ...otherProps } = vNode.props || {};

  if (children) {
    children.forEach((child) => {
      if (typeof child === "string" || typeof child === "number") {
        const textNode = createTextVNode(child);
        vNode._children = [...(vNode._children || []), textNode];
        create(element, textNode);
      }

      if (isVNode(child)) {
        create(element, child);
      }
    });
  }

  if (otherProps) {
    Object.keys(otherProps).forEach((key) => {
      element.setAttribute(key, otherProps[key]);
    });
  }

  parentEl.appendChild(element);
  vNode._html = element;
};

export const render = (
  parentEl: HTMLElement & { vDOM?: VNode },
  vNode: VNode,
) => {
  parentEl.vDOM
    ? diff(parentEl, parentEl.vDOM, vNode)
    : create(parentEl, vNode);
  parentEl.vDOM = vNode;
};
