import { describe, expect, test } from "vitest";
import { z } from "zod";

import { safeMerge } from "@/utils/safe-merge";

describe("safeMerge function", () => {
  const complexSchema = z.object({
    id: z.string(),
    config: z.object({
      enabled: z.boolean(),
      settings: z.object({
        retryCount: z.int(),
        timeout: z.number().positive().optional(),
        advanced: z.object({
          logLevel: z.enum(["debug", "info", "warn", "error"]),
        }),
      }),
    }),
    items: z
      .array(
        z.object({
          itemId: z.string(),
          value: z.number(),
          tags: z.array(z.string()).optional(),
        }),
      )
      .optional(),
  });

  type ComplexType = z.infer<typeof complexSchema>;

  const defaultComplex: ComplexType = {
    id: "default-id",
    config: {
      enabled: false,
      settings: {
        retryCount: 3,
        timeout: 5000,
        advanced: {
          logLevel: "info",
        },
      },
    },
    items: [
      {
        itemId: "item-default",
        value: 0,
        tags: ["default"],
      },
    ],
  };

  const userSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    age: z.number().positive(),
    email: z.email(),
    tags: z.array(z.string()).optional(),
    preferences: z.object({
      theme: z.enum(["light", "dark"]),
      notifications: z.boolean(),
      nested: z.object({
        level: z.number(),
      }),
    }),
  });

  type User = z.infer<typeof userSchema>;

  const defaultUser: User = {
    name: "Default User",
    age: 25,
    email: "default@example.com",
    tags: ["default"],
    preferences: {
      theme: "light",
      notifications: true,
      nested: {
        level: 1,
      },
    },
  };

  test("returns defaults when data is invalid", () => {
    const invalidData = {
      name: 123,
      age: -5,
      email: "not-an-email",
    };

    const result = safeMerge(userSchema, invalidData, defaultUser);
    expect(result).toEqual(defaultUser);
  });

  test("handles nested invalid data", () => {
    const dataWithInvalidNested = {
      name: "Jane Doe",
      preferences: {
        theme: "dark",
        notifications: "yes",
        nested: {
          level: "one",
        },
      },
    };
    const result = safeMerge(userSchema, dataWithInvalidNested, defaultUser);
    expect(result).toEqual({
      ...defaultUser,
      name: "Jane Doe",
      preferences: {
        ...defaultUser.preferences,
        theme: "dark",
      },
    });
  });

  test("merges valid data with defaults, including optional fields", () => {
    const validData = {
      id: "user123",
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      tags: ["test", "user"],
      preferences: {
        theme: "dark",
        nested: {
          level: 2,
        },
      },
    };

    const result = safeMerge(userSchema, validData, defaultUser);
    expect(result).toEqual({
      id: "user123",
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      tags: ["test", "user"],
      preferences: {
        theme: "dark",
        notifications: true,
        nested: {
          level: 2,
        },
      },
    });
  });

  test("ignores extra fields in data not present in schema", () => {
    const dataWithExtraFields = {
      name: "Extra Field User",
      email: "extra@example.com",
      extraField: "should be ignored",
      preferences: {
        theme: "dark",
        notifications: false,
        anotherExtra: 123,
        nested: {
          level: 5,
          yetAnotherExtra: true,
        },
      },
    };

    const result = safeMerge(userSchema, dataWithExtraFields, defaultUser);
    expect(result).toEqual({
      ...defaultUser,
      name: "Extra Field User",
      email: "extra@example.com",
      preferences: {
        theme: "dark",
        notifications: false,
        nested: {
          level: 5,
        },
      },
    });
    expect((result as any).extraField).toBeUndefined();
    expect((result.preferences as any).anotherExtra).toBeUndefined();
    expect((result.preferences.nested as any).yetAnotherExtra).toBeUndefined();
  });

  test("handles null and undefined", () => {
    const result = safeMerge(userSchema, null, defaultUser);
    expect(result).toEqual(defaultUser);
  });

  test("handles deeply nested valid merge", () => {
    const complexData = {
      id: "complex-123",
      config: {
        enabled: true,
        settings: {
          timeout: 10000,
          advanced: {
            logLevel: "debug",
          },
        },
      },
    };
    const result = safeMerge(complexSchema, complexData, defaultComplex);
    expect(result).toEqual({
      id: "complex-123",
      config: {
        enabled: true,
        settings: {
          retryCount: 3,
          timeout: 10000,
          advanced: {
            logLevel: "debug",
          },
        },
      },
      items: defaultComplex.items,
    });
  });

  test("handles deeply nested invalid data", () => {
    const complexData = {
      id: "complex-456",
      config: {
        enabled: "yes",
        settings: {
          retryCount: "five",
          timeout: -100,
          advanced: {
            logLevel: "verbose",
          },
        },
      },
    };
    const result = safeMerge(complexSchema, complexData, defaultComplex);
    expect(result).toEqual({
      ...defaultComplex,
      id: "complex-456",
    });
  });

  test("handles array of objects merge", () => {
    const complexData = {
      items: [
        {
          itemId: "item-1",
          value: 100,
        },
        {
          itemId: "item-2",
          value: 200,
          tags: ["a", "b"],
        },
        {
          itemId: "item-invalid",
          value: "not-a-number",
          tags: [123],
        },
      ],
    };
    const defaultNoItems: ComplexType = {
      ...defaultComplex,
      items: undefined,
    };
    const result = safeMerge(complexSchema, complexData, defaultNoItems);

    // NOTE: The current implementation validates the array field as a whole.
    // If the array contains invalid items, the `safeParse` for the field fails,
    // and the default (or undefined) is used, not a partially merged array.
    expect(result.items).toEqual(defaultNoItems.items);

    // Test with a valid array override
    const validItemsData = {
      items: [{ itemId: "valid-item", value: 999, tags: ["valid"] }],
    };
    const resultValidItems = safeMerge(
      complexSchema,
      validItemsData,
      defaultComplex,
    );
    expect(resultValidItems.items).toEqual([
      { itemId: "valid-item", value: 999, tags: ["valid"] },
    ]);
  });

  test("handles nested object being null or invalid type", () => {
    const dataWithNullConfig = {
      id: "null-config-test",
      config: null,
    };
    const resultNull = safeMerge(
      complexSchema,
      dataWithNullConfig,
      defaultComplex,
    );
    expect(resultNull.config).toEqual(defaultComplex.config);
    expect(resultNull.id).toBe("null-config-test");

    const dataWithInvalidSettings = {
      id: "invalid-settings-test",
      config: {
        enabled: true,
        settings: 123,
      },
    };
    const resultInvalid = safeMerge(
      complexSchema,
      dataWithInvalidSettings,
      defaultComplex,
    );
    expect(resultInvalid.config.enabled).toBe(true);
    expect(resultInvalid.config.settings).toEqual(
      defaultComplex.config.settings,
    );
    expect(resultInvalid.id).toBe("invalid-settings-test");
  });

  test("produces result potentially invalid according to top-level schema constraints (e.g., refine)", () => {
    // Define the base object schema separately for safeMerge
    const baseObjectSchema = z.object({
      minVal: z.number(),
      maxVal: z.number(),
    });
    const refineSchema = baseObjectSchema.refine(
      (data) => data.minVal < data.maxVal,
      {
        path: ["minVal"],
        error: "minVal must be less than maxVal",
      },
    );

    type RefineType = z.infer<typeof refineSchema>;

    const defaultRefine: RefineType = {
      minVal: 1,
      maxVal: 10, // Default is valid (1 < 10)
    };

    const violatingData = {
      minVal: 15, // This value alone is valid (it's a number)
    };

    // safeMerge validates fields individually using the base object schema,
    // it does not consider the refine constraint.
    const mergedResult = safeMerge(
      baseObjectSchema,
      violatingData,
      defaultRefine,
    );

    // The merged result violates the refine constraint (15 is not < 10)
    expect(mergedResult).toEqual({
      minVal: 15,
      maxVal: 10,
    });

    // The merged result is indeed invalid according to the full schema
    const finalValidation = refineSchema.safeParse(mergedResult);
    expect(finalValidation.success).toBe(false);
    expect(finalValidation.error?.issues[0]?.message).toBe(
      "minVal must be less than maxVal",
    );
  });
});
