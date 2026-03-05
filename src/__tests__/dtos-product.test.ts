import test from "node:test";
import assert from "node:assert/strict";
import { CreateProductDTO, UpdateProductDTO } from "../dtos/product.dto";

const validProductPayload = {
  name: "Fresh Tomato",
  description: "Organic tomatoes",
  category: "vegetables" as const,
  price: 120,
  unit: "kg",
  quantity: 50,
  image: "tomato.jpg",
  supplier: "Farmer A",
  farm: "Green Farm",
};

test("CreateProductDTO accepts valid payload", () => {
  const result = CreateProductDTO.safeParse(validProductPayload);
  assert.equal(result.success, true);
});

test("CreateProductDTO rejects invalid category", () => {
  const result = CreateProductDTO.safeParse({
    ...validProductPayload,
    category: "dairy",
  });
  assert.equal(result.success, false);
});

test("CreateProductDTO rejects negative price", () => {
  const result = CreateProductDTO.safeParse({
    ...validProductPayload,
    price: -1,
  });
  assert.equal(result.success, false);
});

test("CreateProductDTO rejects negative quantity", () => {
  const result = CreateProductDTO.safeParse({
    ...validProductPayload,
    quantity: -10,
  });
  assert.equal(result.success, false);
});

test("UpdateProductDTO allows partial update", () => {
  const result = UpdateProductDTO.safeParse({
    price: 200,
  });
  assert.equal(result.success, true);
});

test("UpdateProductDTO rejects invalid availability enum", () => {
  const result = UpdateProductDTO.safeParse({
    availability: "available-now",
  });
  assert.equal(result.success, false);
});

test("UpdateProductDTO accepts empty object", () => {
  const result = UpdateProductDTO.safeParse({});
  assert.equal(result.success, true);
});
