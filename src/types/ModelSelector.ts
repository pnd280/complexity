import { languageModels } from '@/consts/ai-models';
import { webAccessFocus } from '@/consts/web-access-focus';

export type WebAccessFocus = (typeof webAccessFocus)[number] & {
  tooltip?: string;
};

export type LanguageModel = (typeof languageModels)[number] & { tooltip?: any };

export function isValidFocus(focus?: any): focus is WebAccessFocus['code'] {
  return webAccessFocus.some((model) => model.code === focus);
}
