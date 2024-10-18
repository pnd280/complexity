import * as z from "zod";

export const SpaceSchema = z.object({
  title: z.string(),
  uuid: z.string(),
  instructions: z.string(),
  slug: z.string(),
  description: z.string(),
  access: z.literal(1).or(z.literal(2)),
});

export type Space = z.infer<typeof SpaceSchema>;
