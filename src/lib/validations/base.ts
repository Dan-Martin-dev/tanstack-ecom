import { z } from "zod";

// Reusable primitives for validation across the app

export const emailSchema = z.email("Email inválido");

export const passwordSchema = z
  .string()
  .min(8, "Mínimo 8 caracteres")
  .max(100, "Máximo 100 caracteres");

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, "Slug inválido (solo letras minúsculas, números y guiones)");

export const priceSchema = z
  .number()
  .int("El precio debe ser un número entero (centavos)")
  .nonnegative("El precio no puede ser negativo");

export const quantitySchema = z
  .number()
  .int("La cantidad debe ser un número entero")
  .min(1, "Cantidad mínima: 1");

export const uuidSchema = z.uuid("ID inválido");

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type Pagination = z.infer<typeof paginationSchema>;
