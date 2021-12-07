import { VNode } from "./types";
import { isObject, isEqual, isComponentVNode, omit } from "./utils";

const diff = (
  parentEl: HTMLElement,
  prev: VNode | null,
  current: VNode,
  beforeEl?: HTMLElement,
) => {
  if (isComponentVNode(current)) {
    const currentChildren = current.type(current.props);
    current.output = [currentChildren];

    if (!prev) {
      return createEl(parentEl, currentChildren, beforeEl);
    }

    if (!isEqual(prev.output, current.output)) {
      diffChildren(prev?.html || parentEl, prev, current);
    }

    return;
  }

  if (!prev) {
    return createEl(parentEl, current, beforeEl);
  }

  if (prev.type !== current.type) {
    return diffType(parentEl, prev, current);
  }

  if (!isEqual(prev.props, current.props)) {
    diffProps(parentEl, prev, current);
  }

  // if (!isEqual(prev.children, current.children)) {
  //   diffChildren(prev?.html || parentEl, prev, current);
  // }
};

const createEl = (
  parentEl: HTMLElement,
  current: VNode,
  beforeEl?: HTMLElement,
) => {
  const element = document.createElement(current.type as string);
  current.html = element;
  const { children, ...currentProps } = current.props || {};

  for (const k in currentProps) {
    element.setAttribute(k, currentProps[k]);
  }

  // current.children?.forEach((v) => {
  //   if (isObject(v)) {
  //     diff(element, null, v as VNode);
  //     return;
  //   }
  //
  //   const textNode = document.createTextNode(v as string);
  //   element.appendChild(textNode);
  // });

  parentEl.insertBefore(element, beforeEl || null);
};

const diffType = (parentEl: HTMLElement, prev: VNode, current: VNode) => {
  diff(parentEl, null, current, prev.html);
  prev.html && prev.html.remove();
  return;
};

const diffProps = (_parentEl: HTMLElement, prev: VNode, current: VNode) => {
  const currentProps = omit(current.props, "children") || {};
  const prevProps = omit(prev.props, "children") || {};

  for (const k in prevProps) {
    const currentKeys = Object.keys(currentProps);
    if (currentKeys.includes(k)) {
      prev.html &&
        prevProps[k] !== currentProps[k] &&
        prev.html.setAttribute(k, currentProps[k]);
    } else {
      prev.html && prev.html.removeAttribute(k);
    }
  }

  const newAddedKeys = Object.keys(currentProps).filter(
    (v) => !Object.keys(prevProps).includes(v),
  );
  newAddedKeys.forEach((k) => {
    prev.html && prev.html.setAttribute(k, current.props![k]);
  });
};

const diffChildren = (parentEl: HTMLElement, prev: VNode, current: VNode) => {
  prev.output?.forEach((v, idx) => {
    const prevChild = v as VNode;
    const currentChild = current.output ? (current.output[idx] as VNode) : null;

    if (currentChild && isObject(prevChild) && isObject(currentChild)) {
      diff(parentEl, prevChild, currentChild);
      return;
    }

    if (currentChild && !isObject(currentChild)) {
      const content = document.createTextNode(currentChild as any);
      parentEl.appendChild(content);
    }
  });
};

export const render = (
  parentEl: HTMLElement & { vDOM?: VNode },
  vNode: VNode,
) => {
  diff(parentEl, parentEl.vDOM || null, vNode);
  parentEl.vDOM = vNode;
};
