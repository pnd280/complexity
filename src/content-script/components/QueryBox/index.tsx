import { BadgePercent, Library } from "lucide-react";
import { AiOutlineOpenAI } from "react-icons/ai";
import { BiNetworkChart } from "react-icons/bi";
import { PiGlobe } from "react-icons/pi";
import {
  SiAnthropic,
  SiGooglegemini,
  SiMeta,
  SiPerplexity,
  SiYoutube,
} from "react-icons/si";

import {
  imageModels,
  languageModels,
  webAccessFocus,
} from "@/content-script/components/QueryBox/consts";
import MistralAiIcon from "@/shared/components/icons/MistralAiIcon";
import PlaygroundAiIcon from "@/shared/components/icons/PlaygroundAiIcon";
import StabilityAiIcon from "@/shared/components/icons/StabilityAiIcon";

export type LanguageModel = (typeof languageModels)[number];
type Provider = (typeof languageModels)[number]["provider"];

type GroupedLanguageModelsByProvider = [
  Provider,
  (typeof languageModels)[number][],
][];

export const languageModelIcons: Record<LanguageModel["code"], JSX.Element> = {
  claude2: <SiAnthropic />,
  claude3opus: <SiAnthropic />,
  gpt4o: <AiOutlineOpenAI />,
  gpt4: <AiOutlineOpenAI />,
  llama_x_large: <SiPerplexity />,
  experimental: <SiPerplexity />,
  turbo: <SiPerplexity />,
  mistral: <MistralAiIcon />,
  gemini: <SiGooglegemini />,
};

export const groupedLanguageModelsByProvider: GroupedLanguageModelsByProvider =
  Array.from(
    languageModels.reduce((acc: Map<Provider, LanguageModel[]>, model) => {
      const group = acc.get(model.provider) || [];
      group.push(model);
      return acc.set(model.provider, group);
    }, new Map<Provider, LanguageModel[]>()),
  );

export type ImageModel = (typeof imageModels)[number];

export const imageModelIcons: Record<ImageModel["code"], JSX.Element> = {
  "dall-e-3": <SiMeta />,
  default: <PlaygroundAiIcon />,
  sdxl: <StabilityAiIcon />,
};

export type WebAccessFocus = (typeof webAccessFocus)[number];

export const webAccessFocusIcons: Record<WebAccessFocus["code"], JSX.Element> =
  {
    internet: <PiGlobe className="tw-size-4" />,
    scholar: <Library className="tw-size-4" />,
    wolfram: <BadgePercent className="tw-size-4" />,
    youtube: <SiYoutube className="tw-size-4" />,
    reddit: <BiNetworkChart className="tw-size-4" />,
  };
