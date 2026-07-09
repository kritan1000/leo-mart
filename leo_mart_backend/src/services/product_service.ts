import { ProductMongoRepository } from "../repositories/product_repository";
import { IProduct } from "../models/product_model";

const productRepository = new ProductMongoRepository();

export class ProductService {
  async createProduct(productData: any): Promise<IProduct> {
    return productRepository.create(productData);
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return productRepository.findById(id);
  }

  async getProducts(
    page: number,
    size: number,
    search?: string,
    category?: string,
    brand?: string,
    minPrice?: number,
    maxPrice?: number
  ): Promise<{ data: IProduct[]; total: number; totalPages: number; page: number; size: number }> {
    const { data, total } = await productRepository.findAllPaginated(
      page,
      size,
      search,
      category,
      brand,
      minPrice,
      maxPrice
    );
    const totalPages = Math.ceil(total / size);
    return {
      data,
      total,
      totalPages,
      page,
      size,
    };
  }

  async updateProduct(id: string, productData: any): Promise<IProduct | null> {
    return productRepository.update(id, productData);
  }

  async deleteProduct(id: string): Promise<boolean> {
    return productRepository.delete(id);
  }
}
