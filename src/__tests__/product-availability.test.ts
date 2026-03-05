import test from "node:test";
import assert from "node:assert/strict";
import {
  LOW_STOCK_THRESHOLD,
  calculateProductAvailability,
} from "../utils/product-availability";

test("returns out-of-stock when quantity is zero", () => {
  assert.equal(calculateProductAvailability(0), "out-of-stock");
});

test("returns out-of-stock when quantity is negative", () => {
  assert.equal(calculateProductAvailability(-10), "out-of-stock");
});

test("returns low-stock when quantity is one", () => {
  assert.equal(calculateProductAvailability(1), "low-stock");
});

test("returns low-stock at the threshold", () => {
  assert.equal(
    calculateProductAvailability(LOW_STOCK_THRESHOLD),
    "low-stock"
  );
});

test("returns in-stock just above the threshold", () => {
  assert.equal(
    calculateProductAvailability(LOW_STOCK_THRESHOLD + 1),
    "in-stock"
  );
});

test("returns in-stock for large values", () => {
  assert.equal(calculateProductAvailability(1000), "in-stock");
});

test("threshold constant remains 49", () => {
  assert.equal(LOW_STOCK_THRESHOLD, 49);
});

test("handles boundary from low-stock to in-stock correctly", () => {
  assert.notEqual(
    calculateProductAvailability(LOW_STOCK_THRESHOLD),
    calculateProductAvailability(LOW_STOCK_THRESHOLD + 1)
  );
});
