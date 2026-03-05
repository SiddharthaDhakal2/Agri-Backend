import test from "node:test";
import assert from "node:assert/strict";
import { requireAdmin } from "../middleware/admin.middleware";
import { HttpError } from "../errors/http-error";

test("requireAdmin returns 401 when user is missing", () => {
  let nextArg: unknown;

  requireAdmin({} as any, {} as any, (err?: unknown) => {
    nextArg = err;
  });

  assert.ok(nextArg instanceof HttpError);
  assert.equal((nextArg as HttpError).statusCode, 401);
  assert.equal((nextArg as HttpError).message, "Unauthorized");
});

test("requireAdmin returns 403 when role is not admin", () => {
  let nextArg: unknown;

  requireAdmin(
    { user: { role: "user" } } as any,
    {} as any,
    (err?: unknown) => {
      nextArg = err;
    }
  );

  assert.ok(nextArg instanceof HttpError);
  assert.equal((nextArg as HttpError).statusCode, 403);
  assert.equal((nextArg as HttpError).message, "Forbidden (admin only)");
});

test("requireAdmin calls next without error for admin", () => {
  let callCount = 0;
  let nextArg: unknown = "unset";

  requireAdmin(
    { user: { role: "admin" } } as any,
    {} as any,
    (err?: unknown) => {
      callCount += 1;
      nextArg = err;
    }
  );

  assert.equal(callCount, 1);
  assert.equal(nextArg, undefined);
});

test("requireAdmin treats unknown role as forbidden", () => {
  let nextArg: unknown;

  requireAdmin(
    { user: { role: "guest" } } as any,
    {} as any,
    (err?: unknown) => {
      nextArg = err;
    }
  );

  assert.ok(nextArg instanceof HttpError);
  assert.equal((nextArg as HttpError).statusCode, 403);
});
