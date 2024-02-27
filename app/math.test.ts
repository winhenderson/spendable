import { describe, expect, test } from "vitest";
import { calculateSpent, spendableToday } from "./math";

describe("calculateSpent()", () => {
  test("basic cases", () => {
    expect(calculateSpent(2000, [-1000, -500, 20, -5])).toBe(1485);
    expect(calculateSpent(200, [100, -200, -20, -5.35])).toBe(125.35);
    expect(calculateSpent(1, [-1])).toBe(1);
    expect(calculateSpent(1, [200])).toBe(-200);
  });

  test("no transactions", () => {
    expect(calculateSpent(204, [])).toBe(0);
  });

  test("below 0 total", () => {
    expect(calculateSpent(200, [-150, -12, -145, 20, -200])).toBe(487);
    expect(calculateSpent(200, [-201])).toBe(201);
  });

  test("0 total", () => {
    expect(calculateSpent(200, [-200])).toBe(200);
  });

  test("weird transactions", () => {
    expect(calculateSpent(200, [0, 0.1, -0.00000001])).toBe(-0.1);
  });

  test("rounding works", () => {
    expect(calculateSpent(200, [-0.0005])).toBe(0);
    expect(calculateSpent(200, [-0.005])).toBe(0);
    expect(calculateSpent(200, [-0.05])).toBe(0.05);
    expect(calculateSpent(200, [-0.045])).toBe(0.04);
    expect(calculateSpent(200.045, [])).toBe(0);
  });

  test("doesn't give weird NaNs", () => {
    expect(calculateSpent(2000, [-6.33])).toBe(6.33);
  });

  test("doesn't give wildly huge numbers", () => {
    expect(
      calculateSpent(200, [-12, -4.33, -5.4, -6.33, -89.4, -12, -4.33])
    ).toBe(133.79);
  });
});

describe("spendableToday()", () => {
  const testDate = new Date(2024, 0, 9);
  test("basic cases", () => {
    expect(spendableToday(200, 150, testDate)).toBe(2.17);
  });

  test("negative", () => {
    expect(spendableToday(200, 250, testDate)).toBe(0);
  });

  test("0 cases", () => {
    expect(spendableToday(200, 0, testDate)).toBe(8.7);
    expect(spendableToday(200, 200, testDate)).toBe(0);
  });

  test("gained money", () => {
    expect(spendableToday(200, -100, testDate)).toBe(13.04);
  });
});
