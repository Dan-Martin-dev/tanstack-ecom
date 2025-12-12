import { z } from "zod";

// Re-export all validation schemas
export * from "./auth";
export * from "./base";
export * from "./cart";
export * from "./checkout";
export * from "./products";

/**
 * Helper function for validating data against a Zod schema
 * Returns a discriminated union for easy error handling
 */
export function validateRequest<T>(
  schema: z.ZodType<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * Helper to format Zod errors into a simple object
 * Useful for displaying form errors
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }
  return errors;
}

/**
 * Helper to get the first error message from a Zod error
 */
export function getFirstZodError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Error de validación";
}
