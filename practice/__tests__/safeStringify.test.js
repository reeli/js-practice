import {safeStringify} from "../safeStringify";

describe('safeStringify', () => {
  it('should do safe stringify if there are some circular reference', () => {
    var b = {
      b1: "b1",
    };

    var a = {
      a1: "a1",
      a2: "a2",
    };

    b.a = a;
    a.b = b;

    const res = `{"a1":"a1","a2":"a2","b":"<circular>"}`;

    expect(safeStringify(a)).toEqual(res)
  });
});
