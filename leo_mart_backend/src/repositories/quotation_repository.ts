import Quotation, { IQuotation } from "../models/quotation_model";

export interface IQuotationRepository {
  create(data: Partial<IQuotation>): Promise<IQuotation>;
  findAllPaginated(page: number, size: number): Promise<{ data: IQuotation[]; total: number }>;
  updateStatus(id: string, status: "pending" | "reviewed" | "completed"): Promise<IQuotation | null>;
}

export class QuotationMongoRepository implements IQuotationRepository {
  async create(data: Partial<IQuotation>): Promise<IQuotation> {
    return Quotation.create(data);
  }

  async findAllPaginated(page: number, size: number): Promise<{ data: IQuotation[]; total: number }> {
    const skip = (page - 1) * size;
    const total = await Quotation.countDocuments();
    const data = await Quotation.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size);
    return { data, total };
  }

  async updateStatus(id: string, status: "pending" | "reviewed" | "completed"): Promise<IQuotation | null> {
    return Quotation.findByIdAndUpdate(id, { status }, { new: true });
  }
}
