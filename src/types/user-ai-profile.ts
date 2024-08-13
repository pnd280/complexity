import * as z from "zod";

export const UserAiProfileSchema = z.object({
  has_profile: z.boolean(),
  disabled: z.boolean(),
  bio: z.string(),
});

export type UserAiProfile = z.infer<typeof UserAiProfileSchema>;
