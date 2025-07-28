import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.string(),
  type: z.enum(["credit", "debit"]),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data inválida",
  }),
  amount: z.number().min(0),
  observation: z.string().optional(),
  file: z.string().optional(),
  fileName: z.string().optional(),
  categories: z.array(z.string()).optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const UpdateTransactionSchema = TransactionSchema.partial();

