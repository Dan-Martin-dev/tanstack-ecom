import { z } from "zod";
import { emailSchema } from "./base";

export const addressSchema = z.object({
  firstName: z.string().min(1, "Nombre requerido").max(50),
  lastName: z.string().min(1, "Apellido requerido").max(50),
  street: z.string().min(5, "Dirección muy corta").max(200),
  apartment: z.string().max(50).optional(),
  city: z.string().min(2, "Ciudad requerida").max(100),
  province: z.string().min(2, "Provincia requerida").max(100),
  postalCode: z.string().regex(/^\d{4}$/, "Código postal inválido (4 dígitos)"), // Argentina format
  country: z.string().default("Argentina"),
  phone: z
    .string()
    .regex(/^[\d\s+()-]+$/, "Teléfono inválido")
    .min(8, "Teléfono muy corto")
    .max(20, "Teléfono muy largo"),
});

export const checkoutSchema = z
  .object({
    email: emailSchema,
    shippingAddress: addressSchema,
    billingAddress: addressSchema.optional(),
    sameAsBilling: z.boolean().default(true),
    notes: z.string().max(500, "Notas muy largas").optional(),
    paymentMethod: z.enum(["card", "transfer", "cash"]).default("card"),
  })
  .refine(
    (data) => {
      // If not same as billing, billing address is required
      if (!data.sameAsBilling && !data.billingAddress) {
        return false;
      }
      return true;
    },
    {
      message: "Dirección de facturación requerida",
      path: ["billingAddress"],
    },
  );

export const contactInfoSchema = z.object({
  email: emailSchema,
  phone: z
    .string()
    .regex(/^[\d\s+()-]+$/, "Teléfono inválido")
    .optional(),
  subscribeNewsletter: z.boolean().default(false),
});

export type Address = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ContactInfo = z.infer<typeof contactInfoSchema>;
