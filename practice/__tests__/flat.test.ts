import {flat} from "../flat";

describe("flat", () => {
  it("should flat array which contains 1 array", () => {
    expect(flat([1, [1, 2]])).toEqual([1, 1, 2]);
  });

  it("should flat array by given depth 0", () => {
    expect(flat([1, [1, 2, [1, 2]]], 0)).toEqual([1, [1, 2, [1, 2]]]);
  });

  it("should flat array by given depth 1", () => {
    expect(flat([1, [1, 2, [1, 2]]], 1)).toEqual([1, 1, 2, [1, 2]]);
  });

  it("should flat array by given depth Infinity", () => {
    expect(flat([1, [1, 2, [1, 2]]], Infinity)).toEqual([1, 1, 2, 1, 2]);
  });


  it("should flat array which contains array of array", () => {
    expect(flat([1, [1, 2, [3]]])).toEqual([1, 1, 2, [3]]);
  });
});
