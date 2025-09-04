import merge from "lodash/merge";
import { z } from "zod";

/**
 * Safely merges potentially incomplete or partially invalid data with default values based on a Zod schema.
 * Iterates through the schema's fields, validates the corresponding field in the input data,
 * and uses the valid data field's value if validation passes; otherwise, retains the default value.
 * Handles nested objects recursively.
 *
 * The function validates and merges field by field based on the schema's shape.
 * However, it does not perform a final validation on the entire resulting object against the schema,
 * meaning top-level constraints (like `z.refine()` or `z.superRefine()`) are not checked after the merge.
 *
 * @param schema The Zod schema (must be a ZodObject) to validate against.
 * @param data The potentially incomplete or partially invalid data to merge.
 * @param defaults The default values to use when data is missing or invalid.
 * @returns An object containing merged data where valid values from data override defaults.
 */
export function safeMerge<T extends z.ZodObject<any>>(
  schema: T,
  data: unknown,
  defaults: z.infer<T>,
): z.infer<T> {
  if (data === null || typeof data !== "object") {
    return { ...defaults };
  }

  const dataObj = data as Record<string, unknown>;
  const result: Record<string, any> = merge({}, defaults);

  for (const [key, fieldSchema] of Object.entries(schema.shape)) {
    if (Object.prototype.hasOwnProperty.call(dataObj, key)) {
      const fieldValue = dataObj[key];

      if (
        fieldSchema instanceof z.ZodObject &&
        fieldValue !== null &&
        typeof fieldValue === "object" &&
        result[key] !== null &&
        typeof result[key] === "object"
      ) {
        result[key] = safeMerge(fieldSchema, fieldValue, result[key]);
      } else {
        const fieldResult = (fieldSchema as z.ZodType).safeParse(fieldValue);
        if (fieldResult.success) {
          result[key] = fieldResult.data;
        }
      }
    }
  }

  return result as z.infer<T>;
}
