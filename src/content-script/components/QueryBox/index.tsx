import { BadgePercent, Library } from "lucide-react";
import { AiOutlineOpenAI } from "react-icons/ai";
import { BiNetworkChart } from "react-icons/bi";
import { PiGlobe } from "react-icons/pi";
import {
  SiAnthropic,
  SiMeta,
  SiPerplexity,
  SiWikipedia,
  SiYoutube,
} from "react-icons/si";
import { TbLetterM, TbLetterP, TbLetterS } from "react-icons/tb";

export type LanguageModel = (typeof languageModels)[number];
type Provider = (typeof languageModels)[number]["provider"];

type GroupedLanguageModelsByProvider = [
  Provider,
  (typeof languageModels)[number][],
][];

export const languageModels = [
  {
    label: "Claude 3.5 Sonnet",
    shortLabel: "Sonnet",
    code: "claude2",
    icon: <SiAnthropic />,
    provider: "Anthropic",
  },
  {
    label: "Claude 3 Opus",
    shortLabel: "Opus",
    code: "claude3opus",
    icon: <SiAnthropic />,
    provider: "Anthropic",
  },
  {
    label: "Claude 3 Haiku",
    shortLabel: "Haiku",
    code: "turbo",
    icon: <SiAnthropic />,
    provider: "Anthropic",
  },
  {
    label: "GPT-4 Omni",
    shortLabel: "GPT-4o",
    code: "gpt4o",
    icon: <AiOutlineOpenAI />,
    provider: "OpenAI",
  },
  {
    label: "GPT-4 Turbo",
    shortLabel: "GPT-4",
    code: "gpt4",
    icon: <AiOutlineOpenAI />,
    provider: "OpenAI",
  },
  {
    label: "Llama 3.1 405B",
    shortLabel: "Llama 3.1 405B",
    code: "llama_x_large",
    icon: <SiMeta />,
    provider: "Meta",
  },
  {
    label: "Sonar Large",
    shortLabel: "Sonar",
    code: "experimental",
    icon: <SiPerplexity />,
    provider: "Meta",
  },
  {
    label: "Mistral Large",
    shortLabel: "Mistral",
    code: "mistral",
    icon: <TbLetterM />,
    provider: "Mistral",
  },
] as const;

export const groupedLanguageModelsByProvider: GroupedLanguageModelsByProvider =
  Array.from(
    languageModels.reduce((acc: Map<Provider, LanguageModel[]>, model) => {
      const group = acc.get(model.provider) || [];
      group.push(model);
      return acc.set(model.provider, group);
    }, new Map<Provider, LanguageModel[]>()),
  );

export type ImageModel = (typeof imageModels)[number];

export const imageModels = [
  {
    label: "DALL-E 3",
    shortLabel: "DALL-E",
    code: "dall-e-3",
    icon: <AiOutlineOpenAI />,
  },
  {
    label: "Playground",
    shortLabel: "Playground",
    code: "default",
    icon: <TbLetterP />,
  },
  {
    label: "Stable Diffusion XL",
    shortLabel: "SDXL",
    code: "sdxl",
    icon: <TbLetterS />,
  },
] as const;

export type WebAccessFocus = (typeof webAccessFocus)[number];

export const webAccessFocus = [
  {
    label: "All",
    code: "internet",
    icon: <PiGlobe className="tw-text-[1rem]" />,
  },
  {
    label: "Wikipedia",
    code: "wikipedia",
    icon: <SiWikipedia className="tw-text-[1rem]" />,
  },
  {
    label: "Academic",
    code: "scholar",
    icon: <Library className="tw-size-4" />,
  },
  {
    label: "Math",
    code: "wolfram",
    icon: <BadgePercent className="tw-size-4" />,
  },
  {
    label: "Video",
    code: "youtube",
    icon: <SiYoutube className="tw-text-[1rem]" />,
  },
  {
    label: "Social",
    code: "reddit",
    icon: <BiNetworkChart className="tw-text-[1rem]" />,
  },
] as const;
