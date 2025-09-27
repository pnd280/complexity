import type { LanguageModelCode } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import type { PplxWebResult } from "@/services/features/pplx-thread-export";

export type MessageBlock = {
  nodes: {
    $wrapper: JQuery<HTMLElement>;
    $query: JQuery<HTMLElement>;
    $queryEditButtonGroup: JQuery<HTMLElement>;
    $sources: JQuery<HTMLElement>;
    $answer: JQuery<HTMLElement>;
    $footer: JQuery<HTMLElement>;
  };
  content: {
    backendUuid: string;
    title: string;
    answer: string;
    webResults: PplxWebResult[];
    displayModel: LanguageModelCode;
    authorUuid: string | null;
  };
  states: {
    isInFlight: boolean;
    isReadOnly: boolean;
    isEditingQuery: boolean;
    isVirtualized: boolean;
  };
};
