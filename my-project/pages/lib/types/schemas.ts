// types/schemas.ts
import { z } from "zod";

// 1. Define your Zod schema
export const calculatorSchema = z.object({
  currency: z.string().min(1, "Currency is required"),
  crypto: z.string().min(1, "Cryptocurrency is required"),
  investment: z.string().min(1, "Investment amount is required"),
  buyPrice: z.string().min(1, "Buy price is required"),
  sellPrice: z.string().min(1, "Sell price is required"),
  investmentFee: z.string().default("0"),
  exitFee: z.string().default("0"),
});

// 2. Infer the TypeScript type from the schema
export type CalculatorInput = z.infer<typeof calculatorSchema>;
