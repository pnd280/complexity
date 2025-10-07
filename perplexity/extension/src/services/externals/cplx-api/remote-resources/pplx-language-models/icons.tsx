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

import SiClaude from "~icons/simple-icons/claude";
import SiGoogleGemini from "~icons/simple-icons/googlegemini";
import SiOpenai from "~icons/simple-icons/openai";
import SiPerplexity from "~icons/simple-icons/perplexity";
import TablerArrowsShuffle from "~icons/tabler/arrows-shuffle";

export const LanguageModelIcons: Record<LanguageModelIcon, React.ElementType> =
  {
    claude: SiClaude,
    openai: SiOpenai,
    xai: XAiIcon,
    perplexity: SiPerplexity,
    gemini: SiGoogleGemini,
    deepseek: DeepSeek,
    auto: TablerArrowsShuffle,
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
