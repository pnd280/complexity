import { z } from "zod";

import { isBuiltInColorValue } from "@/data/dashboard/themes/built-in-colors";

export const ThemeFormSchema = z
  .object({
    title: z.string().min(1, {
      error: "A title is required",
    }),
    accentColorSelection: z.enum(["built-in", "custom", "default"]),
    accentColor: z.string().transform((val) => val.toUpperCase()),
    builtInAccentColor: z.string().transform((val) => {
      if (isBuiltInColorValue(val)) return val;
      return "cplx-blue";
    }),
    fonts: z.object({
      ui: z.string(),
      mono: z.string(),
    }),
    enhanceThreadTypography: z.boolean(),
    customCss: z.string(),
  })
  .refine(
    (data) => {
      if (data.accentColorSelection === "custom") {
        return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(data.accentColor);
      }
      return true;
    },
    {
      message: "Must be a valid hex color (e.g. #72AEFD)",
      path: ["accentColor"],
    },
  )
  .refine((data) => {
    switch (data.accentColorSelection) {
      case "built-in":
        return !!data.builtInAccentColor;
      case "custom":
        return !!data.accentColor;
      case "default":
        return true;
    }
  });

export type ThemeFormValues = z.infer<typeof ThemeFormSchema>;

export const ThemeSchema = z.object({
  id: z.string().refine((id) => /^[a-zA-Z0-9-]+$/.test(id), {
    error: "Must only contains a-z, A-Z, 0-9, and -",
  }),
  description: z.string(),
  displayBannerColors: z.array(z.string()),
  css: z.string(), // final css when combined with the base css and all the modifications
  config: ThemeFormSchema,
});

export type Theme = z.infer<typeof ThemeSchema>;
