import { Request, Response, NextFunction } from "express";
import { QuotationService } from "../services/quotation_service";
import { CreateQuotationDto } from "../dtos/quotation_dto";
import { ZodError } from "zod";

const quotationService = new QuotationService();

export class QuotationController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parseResult = CreateQuotationDto.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: parseResult.error.issues,
        });
      }

      const quotation = await quotationService.createQuotation(parseResult.data);
      return res.status(201).json({
        success: true,
        message: "Quotation request submitted successfully",
        data: quotation,
      });
    } catch (error) {
      next(error);
    }
  }

  async getQuotations(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;

      const result = await quotationService.getQuotations(page, size);
      return res.status(200).json({
        success: true,
        message: "Quotations fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !["pending", "reviewed", "completed"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value" });
      }

      const updated = await quotationService.updateStatus(id, status);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Quotation request not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Quotation status updated successfully",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
