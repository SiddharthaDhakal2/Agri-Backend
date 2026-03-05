import test from "node:test";
import assert from "node:assert/strict";
import {
  CreateOrderDTO,
  UpdateOrderStatusDTO,
} from "../dtos/order.dto";
import { VerifyKhaltiPaymentDTO } from "../dtos/payment.dto";

const validOrderPayload = {
  items: [
    {
      productId: "507f1f77bcf86cd799439011",
      name: "Fresh Tomato",
      price: 100,
      quantity: 2,
      total: 200,
    },
  ],
  total: 200,
  customerName: "John Doe",
  customerEmail: "john@example.com",
  phone: "9800000000",
  address: "Kathmandu",
};

test("CreateOrderDTO accepts valid payload", () => {
  const result = CreateOrderDTO.safeParse(validOrderPayload);
  assert.equal(result.success, true);
});

test("CreateOrderDTO rejects quantity below 1", () => {
  const result = CreateOrderDTO.safeParse({
    ...validOrderPayload,
    items: [
      {
        ...validOrderPayload.items[0],
        quantity: 0,
      },
    ],
  });
  assert.equal(result.success, false);
});

test("CreateOrderDTO rejects invalid customer email", () => {
  const result = CreateOrderDTO.safeParse({
    ...validOrderPayload,
    customerEmail: "invalid-email",
  });
  assert.equal(result.success, false);
});

test("CreateOrderDTO rejects empty customer name", () => {
  const result = CreateOrderDTO.safeParse({
    ...validOrderPayload,
    customerName: "",
  });
  assert.equal(result.success, false);
});

test("UpdateOrderStatusDTO accepts valid status", () => {
  const result = UpdateOrderStatusDTO.safeParse({
    status: "delivered",
  });
  assert.equal(result.success, true);
});

test("UpdateOrderStatusDTO rejects invalid status", () => {
  const result = UpdateOrderStatusDTO.safeParse({
    status: "done",
  });
  assert.equal(result.success, false);
});

test("VerifyKhaltiPaymentDTO accepts pidx without orderId", () => {
  const result = VerifyKhaltiPaymentDTO.safeParse({
    pidx: "test-pidx",
  });
  assert.equal(result.success, true);
});

test("VerifyKhaltiPaymentDTO rejects empty pidx", () => {
  const result = VerifyKhaltiPaymentDTO.safeParse({
    pidx: "",
  });
  assert.equal(result.success, false);
});
