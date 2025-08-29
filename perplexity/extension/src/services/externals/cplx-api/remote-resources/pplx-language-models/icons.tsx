import { FaShuffle } from "react-icons/fa6";
import {
  SiClaude,
  SiGooglegemini,
  SiOpenai,
  SiPerplexity,
} from "react-icons/si";

import DeepSeek from "@/components/icons/DeepSeek";
import PplxLabsResearch from "@/components/icons/PplxLabsResearch";
import PplxResearch from "@/components/icons/PplxResearch";
import PplxSearch from "@/components/icons/PplxSearch";
import XAiIcon from "@/components/icons/XAiIcon";
import type {
  LanguageModelIcon,
  LanguageModelType,
} from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

export const languageModelIcons: Record<LanguageModelIcon, React.ElementType> &
  Record<string, React.ElementType> = {
  claude: SiClaude,
  openai: SiOpenai,
  xai: XAiIcon,
  perplexity: SiPerplexity,
  gemini: SiGooglegemini,
  deepseek: DeepSeek,
  auto: FaShuffle,
  labs: PplxLabsResearch,
  research: PplxResearch,
};

export const languageModelTypeIcons: Record<
  LanguageModelType,
  React.ElementType
> = {
  search: PplxSearch,
  research: PplxResearch,
  labs: PplxLabsResearch,
};
