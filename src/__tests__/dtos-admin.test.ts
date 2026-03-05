import test from "node:test";
import assert from "node:assert/strict";
import {
  AdminCreateUserDTO,
  AdminUpdateUserDTO,
} from "../dtos/admin.user.dto";

const validAdminCreatePayload = {
  firstName: "Admin",
  lastName: "User",
  email: "admin@example.com",
  name: "adminuser",
  password: "secret123",
  role: "admin" as const,
};

test("AdminCreateUserDTO accepts valid payload", () => {
  const result = AdminCreateUserDTO.safeParse(validAdminCreatePayload);
  assert.equal(result.success, true);
});

test("AdminCreateUserDTO rejects short username", () => {
  const result = AdminCreateUserDTO.safeParse({
    ...validAdminCreatePayload,
    name: "ab",
  });
  assert.equal(result.success, false);
});

test("AdminCreateUserDTO rejects invalid role", () => {
  const result = AdminCreateUserDTO.safeParse({
    ...validAdminCreatePayload,
    role: "superadmin",
  });
  assert.equal(result.success, false);
});

test("AdminUpdateUserDTO accepts empty object", () => {
  const result = AdminUpdateUserDTO.safeParse({});
  assert.equal(result.success, true);
});

test("AdminUpdateUserDTO rejects short password", () => {
  const result = AdminUpdateUserDTO.safeParse({
    password: "123",
  });
  assert.equal(result.success, false);
});

test("AdminUpdateUserDTO accepts valid role update", () => {
  const result = AdminUpdateUserDTO.safeParse({
    role: "admin",
  });
  assert.equal(result.success, true);
});
