import { z } from "zod";

export const BetterCodeBlockGlobalOptionsSchema = z.object({
  stickyHeader: z.boolean(),
  unwrap: z.object({
    enabled: z.boolean(),
    showToggleButton: z.boolean(),
  }),
  showLineNumbers: z.boolean(),
  maxHeight: z.object({
    enabled: z.boolean(),
    collapseByDefault: z.boolean(),
    value: z.number(),
    showToggleButton: z.boolean(),
  }),
  maxWidth: z.object({
    enabled: z.boolean(),
    value: z.number(),
  }),
});

export type BetterCodeBlockGlobalOptions = z.infer<
  typeof BetterCodeBlockGlobalOptionsSchema
>;

export const BetterCodeBlockFineGrainedOptionsSchema =
  BetterCodeBlockGlobalOptionsSchema.extend({
    language: z.string(),
    placeholderText: z.object({
      enabled: z.boolean(),
      title: z.string(),
      idle: z.string(),
      loading: z.string(),
    }),
  });

export type BetterCodeBlockFineGrainedOptions = z.infer<
  typeof BetterCodeBlockFineGrainedOptionsSchema
>;
