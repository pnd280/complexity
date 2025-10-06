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
import PplxStudy from "@/components/icons/PplxStudy";
import XAiIcon from "@/components/icons/XAiIcon";
import type {
  LanguageModelIcon,
  LanguageModelType,
} from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

export const LanguageModelIcons: Record<LanguageModelIcon, React.ElementType> =
  {
    claude: SiClaude,
    openai: SiOpenai,
    xai: XAiIcon,
    perplexity: SiPerplexity,
    gemini: SiGooglegemini,
    deepseek: DeepSeek,
    auto: FaShuffle,
    labs: PplxLabsResearch,
    research: PplxResearch,
    study: PplxStudy,
  };

export const LanguageModelTypeIcons: Record<
  LanguageModelType,
  React.ElementType
> = {
  search: PplxSearch,
  research: PplxResearch,
  studio: PplxLabsResearch,
  study: PplxStudy,
};
