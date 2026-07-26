import Product, { IProduct } from "../models/product_model";

export interface IProductRepository {
  create(product: Partial<IProduct>): Promise<IProduct>;
  findById(id: string): Promise<IProduct | null>;
  findAllPaginated(
    page: number,
    size: number,
    search?: string,
    category?: string,
    brand?: string,
    minPrice?: number,
    maxPrice?: number
  ): Promise<{ data: IProduct[]; total: number }>;
  update(id: string, product: Partial<IProduct>): Promise<IProduct | null>;
  delete(id: string): Promise<boolean>;
}

export class ProductMongoRepository implements IProductRepository {
  async create(product: Partial<IProduct>): Promise<IProduct> {
    const createdProduct = await Product.create(product);
    return createdProduct;
  }

  async findById(id: string): Promise<IProduct | null> {
    const foundProduct = await Product.findById(id);
    return foundProduct;
  }

  async findAllPaginated(
    page: number,
    size: number,
    search?: string,
    category?: string,
    brand?: string,
    minPrice?: number,
    maxPrice?: number
  ): Promise<{ data: IProduct[]; total: number }> {
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = brand;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    const skip = (page - 1) * size;
    const total = await Product.countDocuments(query);
    const data = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size);

    return { data, total };
  }

  async update(id: string, product: Partial<IProduct>): Promise<IProduct | null> {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
    return updatedProduct;
  }

  async delete(id: string): Promise<boolean> {
    const deletedProduct = await Product.findByIdAndDelete(id);
    return !!deletedProduct;
  }
}
