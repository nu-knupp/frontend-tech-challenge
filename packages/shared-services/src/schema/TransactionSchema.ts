import { z } from "zod";

export const TransactionSchema = z.object({
  id: z.string(),
  type: z.enum(["credit", "debit"]),
  date: z.string(),
  amount: z.number(),
  observation: z.string().optional(),
  file: z.string().nullable().optional(),
  fileName: z.string().nullable().optional(),
  categories: z.array(z.string()),
});

// Schema for updating transactions (partial)
export const UpdateTransactionSchema = z.object({
  type: z.enum(["credit", "debit"]).optional(),
  date: z.string().optional(),
  amount: z.number().optional(),
  observation: z.string().optional(),
  file: z.string().nullable().optional(),
  fileName: z.string().nullable().optional(),
  categories: z.array(z.string()).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});
