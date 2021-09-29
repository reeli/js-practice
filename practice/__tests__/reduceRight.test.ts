import {reduceRight} from "../reduceRight";

it("reduce", () => {
  reduceRight(
    [1, 2, 4],
    (res: number, item: number) => {
      return res + item;
    },
    0,
  );
});
