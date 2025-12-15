import { z } from "zod";

export const TTS_VOICES = ["Mike", "Alex", "Kate", "Mary"] as const;

export const TtsVoiceSchema = z.enum(TTS_VOICES);

export type TtsVoice = z.infer<typeof TtsVoiceSchema>;
