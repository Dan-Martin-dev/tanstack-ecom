import { z } from "zod";
import { paginationSchema, priceSchema, slugSchema } from "./base";

export const productImageSchema = z.object({
  url: z.url("URL de imagen inválida"),
  alt: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Nombre requerido").max(255, "Nombre muy largo"),
  slug: slugSchema,
  description: z.string().nullable(),
  price: priceSchema,
  compareAtPrice: priceSchema.nullable(),
  images: z.array(productImageSchema).default([]),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Nombre requerido").max(100, "Nombre muy largo"),
  slug: slugSchema,
  description: z.string().nullable(),
  children: z
    .array(
      z.object({
        name: z.string(),
        slug: slugSchema,
      }),
    )
    .default([]),
});

export const productQuerySchema = paginationSchema.extend({
  category: slugSchema.optional(),
  search: z.string().max(100, "Búsqueda muy larga").optional(),
  sortBy: z.enum(["price", "name", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductImage = z.infer<typeof productImageSchema>;
export type Category = z.infer<typeof categorySchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
