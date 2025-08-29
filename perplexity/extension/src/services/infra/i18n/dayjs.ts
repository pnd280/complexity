import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

import {
  dayjsLocaleImportNamesMap,
  type SupportedLangs,
} from "@/services/infra/i18n/consts";
import { getLanguage } from "@/services/infra/i18n/utils";

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export function unixTimestampToDate({
  unixTimestamp,
  includeTime = true,
}: {
  unixTimestamp: number;
  includeTime?: boolean;
}) {
  return dayjs
    .unix(Math.floor(unixTimestamp / 1000))
    .local()
    .format(includeTime ? "lll" : "ll");
}

export function formatRelativeTime(date: string) {
  const now = dayjs();
  const input = dayjs.utc(date).local();
  const diffHours = now.diff(input, "hour");
  if (diffHours < 24) {
    return input.fromNow();
  }
  return input.format("ll");
}

export async function initializeDayjsLocale() {
  const language = await getLanguage();

  const importsMap: Record<SupportedLangs, () => Promise<unknown>> = {
    "en-US": () => import("dayjs/locale/en"),
    "fr-FR": () => import("dayjs/locale/fr"),
    "de-DE": () => import("dayjs/locale/de"),
    "ja-JP": () => import("dayjs/locale/ja"),
    "ko-KR": () => import("dayjs/locale/ko"),
    "zh-CN": () => import("dayjs/locale/zh-cn"),
    "zh-TW": () => import("dayjs/locale/zh-tw"),
    "es-ES": () => import("dayjs/locale/es"),
    "hi-IN": () => import("dayjs/locale/hi"),
    "it-IT": () => import("dayjs/locale/it"),
    "pt-BR": () => import("dayjs/locale/pt-br"),
    "cs-CZ": () => import("dayjs/locale/cs"),
    "hr-HR": () => import("dayjs/locale/hr"),
    "hu-HU": () => import("dayjs/locale/hu"),
    "pl-PL": () => import("dayjs/locale/pl"),
    "pt-PT": () => import("dayjs/locale/pt"),
    "sk-SK": () => import("dayjs/locale/sk"),
    "sr-Cyrl-ME": () => import("dayjs/locale/sr"),
    "nl-NL": () => import("dayjs/locale/nl"),
    "el-GR": () => import("dayjs/locale/el"),
    "ro-RO": () => import("dayjs/locale/ro"),
    "id-ID": () => import("dayjs/locale/id"),
    "bn-BD": () => import("dayjs/locale/bn"),
    "ru-RU": () => import("dayjs/locale/ru"),
  };

  await importsMap[language as SupportedLangs]?.();
  dayjs.locale(dayjsLocaleImportNamesMap[language as SupportedLangs]);
}
