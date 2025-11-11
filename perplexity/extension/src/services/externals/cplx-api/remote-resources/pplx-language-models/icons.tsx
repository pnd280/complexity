import PplxLabsResearch from "@/components/icons/PplxLabsResearch";
import PplxResearch from "@/components/icons/PplxResearch";
import PplxSearch from "@/components/icons/PplxSearch";
import PplxStudy from "@/components/icons/PplxStudy";
import type {
  LanguageModelIcon,
  LanguageModelType,
} from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

import XAi from "~icons/hugeicons/grok-02";
import KimiAi from "~icons/hugeicons/kimi-ai";
import SiClaude from "~icons/simple-icons/claude";
import SiGoogleGemini from "~icons/simple-icons/googlegemini";
import SiOpenai from "~icons/simple-icons/openai";
import SiPerplexity from "~icons/simple-icons/perplexity";
import TablerArrowsShuffle from "~icons/tabler/arrows-shuffle";

export const LanguageModelIcons: Record<LanguageModelIcon, React.ElementType> =
  {
    claude: SiClaude,
    openai: SiOpenai,
    xai: XAi,
    perplexity: SiPerplexity,
    gemini: SiGoogleGemini,
    kimi: KimiAi,
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
