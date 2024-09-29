import * as z from "zod";

const HasUserAiProfileSchema = z.object({
  has_profile: z.literal(true),
  disabled: z.boolean(),
  bio: z.string(),
});

export type HasUserAiProfile = z.infer<typeof HasUserAiProfileSchema>;

const NoUserAiProfileSchema = z.object({
  has_profile: z.literal(false),
});

export type NoUserAiProfile = z.infer<typeof NoUserAiProfileSchema>;

export const UserAiProfileSchema = z.union([
  HasUserAiProfileSchema,
  NoUserAiProfileSchema,
]);

export type UserAiProfile = z.infer<typeof UserAiProfileSchema>;
