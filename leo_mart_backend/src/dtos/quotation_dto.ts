import { z } from "zod";

export const CreateQuotationDto = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(7, "Phone number must be at least 7 digits"),
  items: z.string().min(5, "Please specify items and quantities"),
});

export type CreateQuotationDto = z.infer<typeof CreateQuotationDto>;
