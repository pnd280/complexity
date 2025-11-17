import { z } from "zod";

export const SlashCommandMenuTabShortcutKeybindingSchema = z.object({
  type: z.literal("keybinding"),
  value: z.array(z.string()),
});

export const SlashCommandMenuTabShortcutCommandSchema = z.object({
  type: z.literal("command"),
  value: z.string(),
});

export const SlashCommandMenuTabShortcutSchema = z.discriminatedUnion("type", [
  SlashCommandMenuTabShortcutKeybindingSchema,
  SlashCommandMenuTabShortcutCommandSchema,
]);

export type SlashCommandMenuTabShortcutKeybinding = z.infer<
  typeof SlashCommandMenuTabShortcutKeybindingSchema
>;

export type SlashCommandMenuTabShortcutCommand = z.infer<
  typeof SlashCommandMenuTabShortcutCommandSchema
>;

export type SlashCommandMenuTabShortcut = z.infer<
  typeof SlashCommandMenuTabShortcutSchema
>;

export type SlashCommandMenuTabShortcutCatalog = {
  [P in SlashCommandMenuTabShortcut as P["type"]]: P;
};
