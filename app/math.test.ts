import { expect, test } from "vitest";
import { add } from "./math";

test("adder works", () => {
  expect(add(1, 2)).toBe(3);
});
