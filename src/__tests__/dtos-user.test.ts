import test from "node:test";
import assert from "node:assert/strict";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";

const validCreatePayload = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  name: "johndoe",
  password: "secret123",
  confirmPassword: "secret123",
};

test("CreateUserDTO accepts a valid payload", () => {
  const result = CreateUserDTO.safeParse(validCreatePayload);
  assert.equal(result.success, true);
});

test("CreateUserDTO rejects invalid email", () => {
  const result = CreateUserDTO.safeParse({
    ...validCreatePayload,
    email: "invalid-email",
  });
  assert.equal(result.success, false);
});

test("CreateUserDTO rejects short password", () => {
  const result = CreateUserDTO.safeParse({
    ...validCreatePayload,
    password: "123",
    confirmPassword: "123",
  });
  assert.equal(result.success, false);
});

test("CreateUserDTO rejects password mismatch", () => {
  const result = CreateUserDTO.safeParse({
    ...validCreatePayload,
    confirmPassword: "different123",
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.error.issues[0]?.path.join("."), "confirmPassword");
  }
});

test("CreateUserDTO rejects missing name", () => {
  const result = CreateUserDTO.safeParse({
    ...validCreatePayload,
    name: "",
  });
  assert.equal(result.success, false);
});

test("LoginUserDTO accepts valid credentials", () => {
  const result = LoginUserDTO.safeParse({
    email: "john@example.com",
    password: "secret123",
  });
  assert.equal(result.success, true);
});

test("LoginUserDTO rejects invalid email", () => {
  const result = LoginUserDTO.safeParse({
    email: "john-at-example.com",
    password: "secret123",
  });
  assert.equal(result.success, false);
});

test("LoginUserDTO rejects short password", () => {
  const result = LoginUserDTO.safeParse({
    email: "john@example.com",
    password: "123",
  });
  assert.equal(result.success, false);
});
