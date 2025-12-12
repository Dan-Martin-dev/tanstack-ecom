import { z } from "zod";
import { priceSchema, quantitySchema, uuidSchema } from "./base";

export const cartItemSchema = z.object({
  productId: uuidSchema,
  variantId: uuidSchema.optional(),
  name: z.string(),
  slug: z.string(),
  image: z.string(),
  price: priceSchema,
  quantity: quantitySchema,
  maxStock: z.number().int().nonnegative(),
});

export const addToCartSchema = z.object({
  productId: uuidSchema,
  variantId: uuidSchema.optional(),
  quantity: quantitySchema.default(1),
});

export const updateCartQuantitySchema = z.object({
  productId: uuidSchema,
  quantity: quantitySchema,
});

export const removeFromCartSchema = z.object({
  productId: uuidSchema,
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartQuantityInput = z.infer<typeof updateCartQuantitySchema>;
export type RemoveFromCartInput = z.infer<typeof removeFromCartSchema>;
