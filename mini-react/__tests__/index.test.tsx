// @ts-nocheck
import {createElement, render, flat} from "../index";

describe('createElement', () => {
  it('should create dom element', () => {
    expect(createElement("div", {id: "my-div", content: 123})).toEqual({
      type: "div",
      props: {
        id: "my-div",
        content: 123
      },
      children: null
    })
  });

  it('should create component', () => {
    const Hello = (props) => (
      <div id="container">
        <span>{props.greet}</span>
        {props.children}
      </div>
    );
    const child = createElement("div", {id: "name"}, ["rui"]);

    expect(createElement(Hello, {name: "rui"}, [child])).toEqual({
      type: Hello,
      props: {
        name: "rui",
        children: [
          {
            type: "div",
            props: {id: "name"},
            children: ["rui"]
          }
        ]
      },
    })
  });

  it("should create component without props and children", () => {
    const Foo = () => createElement("div", {id: "foo"}, [1]);
    expect(createElement(Foo, {}, null)).toEqual({
      type: Foo,
      props: {
        children: null
      },
    });
  });

  it("should create component with multiple child", () => {
    const Foo = (props) => {
      return createElement("div", {id: "foo"}, [
        createElement("span", null, [props.greet]),
        props.children
      ])
    };

    expect(Foo({greet: "hello", children: "content"})).toEqual({
      type: "div",
      props: {
        id: "foo",
      },
      children: [
        {
          type: "span",
          props: null,
          children: ["hello"]
        },
        "content"
      ]
    });
    expect(createElement(Foo, {greet: "hello"}, ["content1"])).toEqual({
      type: Foo,
      props: {greet: "hello", children: ["content1"]},
    })
  })

  it('should render VNode to html', () => {
    const div = document.createElement("div")
    render(div, createElement("div", {id: "my-div"}, [123, 456, "hello-world"]));

    expect(div.innerHTML).toEqual(`<div id="my-div">123456hello-world</div>`)
  });

  it('should render VNode to html with VNode children', () => {
    const div = document.createElement("div")
    const child = createElement("span", {id: "content"}, ["my content"]);
    render(div, createElement("div", {id: "my-div"}, [child]));

    expect(div.innerHTML).toEqual(`<div id="my-div"><span id="content">my content</span></div>`)
  });

  it('should render VNode to html with VNode children', () => {
    const div = document.createElement("div")
    const child = createElement("span", {id: "content"}, ["my content"]);

    render(div, createElement("div", {id: "my-div"}, [child]));
    expect(div.innerHTML).toEqual(`<div id="my-div"><span id="content">my content</span></div>`)

    const preDiv = div.querySelector("#my-div")

    render(div, createElement("div", {id: "my-div-2"}, [child]));
    expect(div.innerHTML).toEqual(`<div id="my-div-2"><span id="content">my content</span></div>`)

    expect(div.querySelector("#my-div-2")).toEqual(preDiv);
  });

  it('should render new added attributes', () => {
    const div = document.createElement("div")
    const child = createElement("span", {id: "content"}, ["my content"]);

    render(div, createElement("div", {id: "my-div"}, [child]));
    expect(div.innerHTML).toEqual(`<div id="my-div"><span id="content">my content</span></div>`)

    render(div, createElement("div", {id: "my-div-2", name: "good"}, [child]));
    expect(div.innerHTML).toEqual(`<div id="my-div-2" name="good"><span id="content">my content</span></div>`)
  });

  it('should diff single child', () => {
    const div = document.createElement("div")
    const child1 = createElement("span", {id: "content"}, ["my content"]);

    render(div, createElement("div", {id: "my-div"}, [child1]));
    expect(div.innerHTML).toEqual(`<div id="my-div"><span id="content">my content</span></div>`)

    const child2 = createElement("span", {id: "content2"}, ["my content2"]);

    render(div, createElement("div", {id: "my-div-2"}, [child2]));
    expect(div.innerHTML).toEqual(`<div id="my-div-2"><span id="content2">my content2</span></div>`)
  });

  it('should diff with multiple child', () => {
    const root = document.createElement("div")
    const child1 = createElement("span", {id: "content1"}, ["1"]);
    const child2 = createElement("span", {id: "content2"}, ["2"]);

    render(root, createElement("div", {id: "root"}, [child1, child2]));
    expect(root.innerHTML).toEqual(`<div id="root"><span id="content1">1</span><span id="content2">2</span></div>`)

    const prevContent1 = root.querySelector("#content1");
    const prevContent2 = root.querySelector("#content2");

    const child3 = createElement("div", {id: "content3"}, ["3"]);
    render(root, createElement("div", {id: "div-3"}, [child3, child2]));
    const currentContent2 = root.querySelector("#content2");
    const currentContent3 = root.querySelector("#content3");

    expect(prevContent1).not.toEqual(currentContent3);
    expect(prevContent2).toEqual(currentContent2);

    expect(root.innerHTML).toEqual(`<div id="div-3"><div id="content3">3</div><span id="content2">2</span></div>`)
  });

  it('should diff components', () => {
    const root = document.createElement("div");
    const Foo = (props) => {
      return createElement("div", {id: "foo"}, [
        createElement("span", null, [props.greet]),
        props.children
      ])
    };

    render(root, createElement(Foo, {greet: "hello"}, ["content1"]));
    // const prevContent = root.querySelector("#foo");
    expect(root.innerHTML).toEqual(`<div id="foo"><span>hello</span>content1</div>`)

    render(root, createElement(Foo, {greet:"good"}, ["content2"]));
    expect(root.innerHTML).toEqual(`<div><div id="foo"><span>good</span>content2</div></div>`)
    // const currentContent = root.querySelector("#foo");
    //
    // expect(prevContent).toEqual(currentContent);
  });
});


describe("flat", () => {
  it('should flat array', () => {
    expect(flat([1, 2, [3]])).toEqual([1, 2, 3])
  });
})
