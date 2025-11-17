import { create } from "mutative";

import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import { pplxCookiesStore } from "@/entrypoints/contexts/content-scripts/stores/pplx-cookies-store";
import type { QueryBoxType } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/types";
import type {
  LanguageModelCode,
  LanguageModelType,
} from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import { setCookie } from "@/utils/dom-utils/generics";

export function getActiveQueryBoxTextbox({
  type,
}: {
  type?: QueryBoxType;
} = {}): JQuery<HTMLTextAreaElement> {
  if (!type)
    return $(
      `${DomSelectorsService.Root.cachedSync.QUERY_BOX.TEXTBOX.ARBITRARY}:last`,
    );

  const selectorMap: Record<QueryBoxType, string> = {
    main: DomSelectorsService.Root.cachedSync.QUERY_BOX.TEXTBOX.MAIN,
    space: DomSelectorsService.Root.cachedSync.QUERY_BOX.TEXTBOX.SPACE,
    "follow-up":
      DomSelectorsService.Root.cachedSync.QUERY_BOX.TEXTBOX.FOLLOW_UP,
    "comet-assistant":
      DomSelectorsService.Root.cachedSync.QUERY_BOX.TEXTBOX.COMET_ASSISTANT,
  };

  return $(selectorMap[type]);
}

export function getActiveQueryBox({ type }: { type?: QueryBoxType } = {}) {
  return getActiveQueryBoxTextbox({
    type,
  })
    .parents(DomSelectorsService.Root.cachedSync.QUERY_BOX.WRAPPER.ARBITRARY)
    .first();
}

export function isLexical(textbox: HTMLElement) {
  return (
    textbox.isContentEditable && textbox.hasAttribute("data-lexical-editor")
  );
}

const cookieName = "pplx.search-models-v4";

export function setModelCookie({
  type,
  modelCode,
}: {
  type: LanguageModelType;
  modelCode: LanguageModelCode;
}) {
  const cookie = pplxCookiesStore
    .getState()
    .cookies.find((cookie) => cookie.name === cookieName);

  if (!cookie) {
    setCookie(
      cookieName,
      JSON.stringify({
        ...getDefaultModelCookie(),
        ...{ [type]: modelCode },
      } satisfies Record<LanguageModelType, LanguageModelCode>),
      30,
    );
    return;
  }

  const [parsedCookie] = tryCatch(
    () =>
      JSON.parse(decodeURIComponent(cookie.value)) as Record<
        LanguageModelType,
        LanguageModelCode
      >,
  );

  if (parsedCookie == null) {
    setCookie(
      cookieName,
      JSON.stringify({
        ...getDefaultModelCookie(),
        ...{ [type]: modelCode },
      }),
      30,
    );
    return;
  }

  const newValue = create(parsedCookie, (draft) => {
    draft[type] = modelCode;
  });

  pplxCookiesStore.setState({
    cookies: [
      ...pplxCookiesStore.getState().cookies,
      { name: cookieName, value: JSON.stringify(newValue) },
    ],
  });

  setCookie(cookieName, JSON.stringify(newValue), 30);
}

export function getModelCookie({ type }: { type: LanguageModelType }) {
  const cookie = pplxCookiesStore
    .getState()
    .cookies.find((cookie) => cookie.name === cookieName);

  if (!cookie) {
    return null;
  }

  const [parsedCookie] = tryCatch(
    () =>
      JSON.parse(decodeURIComponent(cookie.value)) as Record<
        LanguageModelType,
        LanguageModelCode
      >,
  );

  return parsedCookie?.[type] ?? null;
}

function getDefaultModelCookie(): Record<LanguageModelType, LanguageModelCode> {
  return {
    search: "pplx_pro",
    research: "pplx_alpha",
    studio: "pplx_beta",
    study: "pplx_study",
  };
}
