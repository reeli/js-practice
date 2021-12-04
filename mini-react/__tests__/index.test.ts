import {createElement, render} from "../index";

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

  it('should render VNode to html', () => {
    const div = document.createElement("div")
    render(div, createElement("div", {id: "my-div"}, [123, 456, "hello-world"]));

    expect(div.innerHTML).toEqual(`<div id="my-div">123456hello-world</div>`)
  });
});
