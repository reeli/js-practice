import { VNode, ElementVNode } from "./types";
import { isEqual, isComponentVNode, omit, isTextNode, isVNode } from "./utils";
import { createTextVNode } from "./create-element";

const diff = (
  parentEl: HTMLElement,
  prev: VNode | null,
  current: VNode,
  beforeEl?: HTMLElement,
) => {
  if (!prev) {
    if (isComponentVNode(current)) {
      const children = [current.type(current.props)];
      setChildren(current, children);

      current._children?.forEach((c) => {
        diff(parentEl, null, c);
      });
      return;
    }

    if (isTextNode(current)) {
      return renderText(parentEl, current);
    }

    if (isVNode(current)) {
      renderElement(parentEl, current as ElementVNode, beforeEl);
      current._children?.forEach((c) => {
        diff(current._html, null, c);
      });
      return;
    }

    return;
  }

  if (isComponentVNode(current)) {
    current._children = [current.type(current.props)];
    return diffChildren(parentEl, prev, current);
  }

  if (prev.type === current.type && isEqual(prev.props, current.props)) {
    return;
  }

  if (prev.type !== current.type) {
    return diffType(parentEl, prev, current);
  }

  const { children: currentChildren, ...currentProps } = current.props;
  const { children: prevChildren, ...prevProps } = prev.props;

  if (!isEqual(prevProps, currentProps)) {
    if (current.type === "textNode") {
      diffTextNode(parentEl, prev, current);
    } else {
      diffProps(parentEl, prev, current);
    }
  }

  currentChildren && setChildren(current, currentChildren);

  if (!isEqual(prev._children, current._children)) {
    diffChildren(prev._html || parentEl, prev, current);
    current._html = prev._html;
  }
};

const renderText = (parentEl: HTMLElement, current: VNode) => {
  const textNode = document.createTextNode(current.props.content);
  textNode.nodeValue = current.props.content;
  parentEl.insertBefore(textNode, null);
  current._html = textNode;
};

const setChildren = (current: VNode, children: any[]) => {
  current._children = [];

  children?.forEach((c) => {
    if (typeof c === "string" || typeof c === "number") {
      const textVNode = createTextVNode(c);
      current._children.push(textVNode);
    }

    if (isVNode(c)) {
      current._children?.push(c);
    }
  });
};

const renderElement = (
  parentEl: HTMLElement,
  current: ElementVNode,
  beforeEl?: HTMLElement | null,
) => {
  const element = document.createElement(current.type);
  const { children, ...otherProps } = current.props || {};

  for (const k in otherProps) {
    element.setAttribute(k, otherProps[k]);
  }

  children && setChildren(current, children);

  parentEl.insertBefore(element, beforeEl || null);
  current._html = element;
};

const diffType = (
  parentEl: HTMLElement,
  prev: VNode | null,
  current: VNode,
) => {
  diff(parentEl, null, current, prev?._html);
  prev && prev._html?.remove();
};

const diffProps = (_parentEl: HTMLElement, prev: VNode, current: VNode) => {
  const currentProps = omit(current.props, "children") || {};
  const prevProps = omit(prev.props, "children") || {};
  current._html = prev._html;

  for (const k in prevProps) {
    const currentKeys = Object.keys(currentProps);
    if (currentKeys.includes(k)) {
      current._html &&
        prevProps[k] !== currentProps[k] &&
        current._html.setAttribute(k, currentProps[k]);
    } else {
      current._html && current._html.removeAttribute(k);
    }
  }

  const newAddedKeys = Object.keys(currentProps).filter(
    (v) => !Object.keys(prevProps).includes(v),
  );
  newAddedKeys.forEach((k) => {
    current._html && current._html.setAttribute(k, current.props![k]);
  });
};

const diffChildren = (parentEl: HTMLElement, prev: VNode, current: VNode) => {
  current._children?.forEach((currentChildren, idx) => {
    const prevChildren = prev._children ? prev._children[idx] : null;
    diff(parentEl, prevChildren, currentChildren);
  });
};

const diffTextNode = (_parentEl: HTMLElement, prev: VNode, current: VNode) => {
  current._html = prev._html;
  current._html.nodeValue = current.props.content;
};

const create = (vNode: VNode, parentEl: HTMLElement) => {
  if (typeof vNode.type === "function") {
    const _children = vNode.type(vNode.props);
    vNode._children = [_children];

    create(_children, parentEl);

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
        create(textNode, element);
      }

      if (isVNode(child)) {
        create(child, element);
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
  if (!parentEl.vDOM) {
    create(vNode, parentEl);
    parentEl.vDOM = vNode;
  } else {
    // diff(parentEl, parentEl.vDOM || null, vNode);
  }
  parentEl.vDOM = vNode;
};
