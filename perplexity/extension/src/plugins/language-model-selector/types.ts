import type { ReactNode } from "react";

import type {
  LanguageModel,
  LanguageModelCode,
} from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";

export type TooltipPlacement = "left" | "right";

export type ModelLimits = Partial<Record<LanguageModelCode, number | null>>;

export type LanguageModelGroupProps = {
  title: ReactNode;
  models: LanguageModel[];
  tooltipPlacement?: TooltipPlacement;
  titleTooltip?: ReactNode;
};
