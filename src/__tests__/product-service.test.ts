import test from "node:test";
import assert from "node:assert/strict";
import { ProductService } from "../services/product.service";
import { ProductRepository } from "../repositories/product.repository";
import { HttpError } from "../errors/http-error";

const originalMethods = {
  createProduct: ProductRepository.prototype.createProduct,
  getProductById: ProductRepository.prototype.getProductById,
  getAllProducts: ProductRepository.prototype.getAllProducts,
  searchProducts: ProductRepository.prototype.searchProducts,
  updateProduct: ProductRepository.prototype.updateProduct,
};

const restoreMethods = () => {
  ProductRepository.prototype.createProduct = originalMethods.createProduct;
  ProductRepository.prototype.getProductById = originalMethods.getProductById;
  ProductRepository.prototype.getAllProducts = originalMethods.getAllProducts;
  ProductRepository.prototype.searchProducts = originalMethods.searchProducts;
  ProductRepository.prototype.updateProduct = originalMethods.updateProduct;
};

test("ProductService.createProduct delegates to repository", async () => {
  const service = new ProductService();
  const payload = {
    name: "Apple",
    description: "Fresh apple",
    category: "fruits",
    price: 120,
    unit: "kg",
    quantity: 60,
    image: "apple.jpg",
    supplier: "Supplier A",
    farm: "Farm A",
  } as any;

  let captured: any;
  const expected = { _id: "p1", ...payload };

  ProductRepository.prototype.createProduct = async (data: any) => {
    captured = data;
    return expected as any;
  };

  try {
    const result = await service.createProduct(payload);
    assert.deepEqual(result, expected);
    assert.deepEqual(captured, payload);
  } finally {
    restoreMethods();
  }
});

test("ProductService.getProductById returns product when found", async () => {
  const service = new ProductService();
  const expected = { _id: "p1", name: "Apple" };

  ProductRepository.prototype.getProductById = async () => expected as any;

  try {
    const result = await service.getProductById("p1");
    assert.deepEqual(result, expected);
  } finally {
    restoreMethods();
  }
});

test("ProductService.getProductById throws 404 when product is missing", async () => {
  const service = new ProductService();

  ProductRepository.prototype.getProductById = async () => null;

  try {
    await assert.rejects(
      () => service.getProductById("missing"),
      (error: unknown) => {
        assert.ok(error instanceof HttpError);
        assert.equal((error as HttpError).statusCode, 404);
        assert.equal((error as HttpError).message, "Product not found");
        return true;
      }
    );
  } finally {
    restoreMethods();
  }
});

test("ProductService.searchProducts uses getAllProducts for blank query", async () => {
  const service = new ProductService();
  const expected = [{ _id: "p1" }, { _id: "p2" }];

  let getAllCalled = 0;
  let searchCalled = 0;

  ProductRepository.prototype.getAllProducts = async () => {
    getAllCalled += 1;
    return expected as any;
  };

  ProductRepository.prototype.searchProducts = async () => {
    searchCalled += 1;
    return [] as any;
  };

  try {
    const result = await service.searchProducts("   ");
    assert.deepEqual(result, expected);
    assert.equal(getAllCalled, 1);
    assert.equal(searchCalled, 0);
  } finally {
    restoreMethods();
  }
});

test("ProductService.updateProduct throws 404 when repository returns null", async () => {
  const service = new ProductService();

  ProductRepository.prototype.updateProduct = async () => null;

  try {
    await assert.rejects(
      () => service.updateProduct("missing", { price: 50 } as any),
      (error: unknown) => {
        assert.ok(error instanceof HttpError);
        assert.equal((error as HttpError).statusCode, 404);
        assert.equal((error as HttpError).message, "Product not found");
        return true;
      }
    );
  } finally {
    restoreMethods();
  }
});
