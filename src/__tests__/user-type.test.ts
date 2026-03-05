import test from "node:test";
import assert from "node:assert/strict";
import { UserSchema } from "../types/user.type";

test("UserSchema accepts minimal valid user and applies default role", () => {
  const result = UserSchema.safeParse({
    name: "john",
    email: "john@example.com",
    password: "secret123",
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.role, "user");
  }
});

test("UserSchema rejects invalid email", () => {
  const result = UserSchema.safeParse({
    name: "john",
    email: "invalid",
    password: "secret123",
  });
  assert.equal(result.success, false);
});

test("UserSchema accepts nullable reset fields", () => {
  const result = UserSchema.safeParse({
    name: "john",
    email: "john@example.com",
    password: "secret123",
    resetOtp: null,
    resetOtpExpiry: null,
  });
  assert.equal(result.success, true);
});

test("UserSchema rejects unsupported role", () => {
  const result = UserSchema.safeParse({
    name: "john",
    email: "john@example.com",
    password: "secret123",
    role: "manager",
  });
  assert.equal(result.success, false);
});
