import { QuotationMongoRepository } from "../repositories/quotation_repository";
import { IQuotation } from "../models/quotation_model";

const quotationRepository = new QuotationMongoRepository();

export class QuotationService {
  async createQuotation(data: any): Promise<IQuotation> {
    return quotationRepository.create(data);
  }

  async getQuotations(
    page: number,
    size: number
  ): Promise<{ data: IQuotation[]; total: number; totalPages: number; page: number; size: number }> {
    const { data, total } = await quotationRepository.findAllPaginated(page, size);
    const totalPages = Math.ceil(total / size);
    return {
      data,
      total,
      totalPages,
      page,
      size,
    };
  }

  async updateStatus(id: string, status: "pending" | "reviewed" | "completed"): Promise<IQuotation | null> {
    return quotationRepository.updateStatus(id, status);
  }
}
