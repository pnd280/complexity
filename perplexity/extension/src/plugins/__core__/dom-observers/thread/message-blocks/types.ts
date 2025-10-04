import type { PplxWebResult } from "@/plugins/__core__/pplx-thread-export";
import type { LanguageModelCode } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

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
