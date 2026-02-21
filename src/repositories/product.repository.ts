import { CreateProductDTO, UpdateProductDTO } from "../dtos/product.dto";
import { IProduct, ProductModel } from "../models/product.model";

export class ProductRepository {
  private calculateAvailability(quantity: number): "in-stock" | "low-stock" | "out-of-stock" {
    if (quantity === 0) {
      return "out-of-stock";
    } else if (quantity < 20) {
      return "low-stock";
    } else {
      return "in-stock";
    }
  }

  async createProduct(data: CreateProductDTO): Promise<IProduct> {
    const availability = this.calculateAvailability(data.quantity);
    const product = new ProductModel({ ...data, availability });
    return product.save();
  }

  async getAllProducts(): Promise<IProduct[]> {
    return ProductModel.find();
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return ProductModel.findById(id);
  }

  async getProductsByCategory(category: string): Promise<IProduct[]> {
    return ProductModel.find({ category });
  }

  async updateProduct(id: string, data: UpdateProductDTO): Promise<IProduct | null> {
    return ProductModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProduct(id: string): Promise<IProduct | null> {
    return ProductModel.findByIdAndDelete(id);
  }

  async searchProducts(query: string): Promise<IProduct[]> {
    return ProductModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { farm: { $regex: query, $options: "i" } },
      ],
    });
  }

  async updateStock(id: string, quantity: number): Promise<IProduct | null> {
    const product = await ProductModel.findById(id);
    if (!product) return null;

    let availability: "in-stock" | "low-stock" | "out-of-stock";
    if (quantity === 0) {
      availability = "out-of-stock";
    } else if (quantity < 50) {
      availability = "low-stock";
    } else {
      availability = "in-stock";
    }

    return ProductModel.findByIdAndUpdate(
      id,
      { quantity, availability },
      { new: true }
    );
  }
}
