import { VNode } from "./types";
import { isObject, isEqual } from "./utils";

const diffChildren = (parentEl: HTMLElement, prev: VNode, current: VNode) => {
  prev.children?.forEach((v, idx) => {
    const prevChild = v as VNode;
    const currentChild = current.children ? (current.children[idx] as VNode) : null;

    if (currentChild && isObject(prevChild) && isObject(currentChild)) {
      diff(parentEl, prevChild, currentChild);
      return;
    }

    if (currentChild && !isObject(currentChild)) {
      const content = document.createTextNode(currentChild as any);
      parentEl.replaceChildren(content);
    }
  });
};

const diffType = (parentEl: HTMLElement, prev: VNode, current: VNode) => {
  diff(parentEl, null, current, prev.html);
  prev.html && prev.html.remove();
  return;
};

const diffProps = (prev: VNode, current: VNode) => {
  for (const k in prev.props) {
    const currentKeys = Object.keys(current.props);
    if (currentKeys.includes(k)) {
      prev.html && prev.props[k] !== current.props[k] && prev.html.setAttribute(k, current.props[k]);
    } else {
      prev.html && prev.html.removeAttribute(k);
    }
  }

  const newAddedKeys = Object.keys(current.props).filter((v) => !Object.keys(prev.props).includes(v));
  newAddedKeys.forEach((k) => {
    prev.html && prev.html.setAttribute(k, current.props[k]);
  });
};

const createEl = (parentEl: HTMLElement, current: VNode, beforeEl?: HTMLElement) => {
  const element = document.createElement(current.type as string);
  current.html = element;

  for (const k in current.props) {
    element.setAttribute(k, current.props[k]);
  }

  current.children?.forEach((v) => {
    if (isObject(v)) {
      diff(element, null, v as VNode);
      return;
    }

    const textNode = document.createTextNode(v as string);
    element.appendChild(textNode);
  });

  parentEl.insertBefore(element, beforeEl || null);
};

const diff = (parentEl: HTMLElement, prev: VNode | null, current: VNode, beforeEl?: HTMLElement) => {
  if (!prev) {
    if (typeof current.type === "function") {
      const n = current.type(current.props);
      current.children = [n];

      createEl(parentEl, n, beforeEl);
      return;
    }

    createEl(parentEl, current, beforeEl);
    return;
  }

  if (typeof current.type === "function") {
    current.children = [current.type(current.props)];
    diffChildren(prev?.html || parentEl, prev, current);
  }

  if (prev.type !== current.type) {
    diffType(parentEl, prev, current);
    return;
  }

  if (!isEqual(prev.props, current.props)) {
    diffProps(prev, current);
  }

  if (!isEqual(prev.children, current.children)) {
    diffChildren(prev?.html || parentEl, prev, current);
  }
};

export const render = (parentEl: HTMLElement & { vDOM?: VNode }, vNode: VNode) => {
  diff(parentEl, parentEl.vDOM || null, vNode);
  parentEl.vDOM = vNode;
};
