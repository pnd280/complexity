import type { defineTranslation, ParamOptions } from "@/lib/defineTranslation";
import type { TranslationsRegistry } from "@/lib/registry";

export type RegisteredTranslations = keyof TranslationsRegistry extends never
  ? LanguageMessages
  : TranslationsRegistry;

type I18nMessage = string | ReturnType<typeof defineTranslation>;

export type LanguageMessages = {
  [key: string]: I18nMessage | LanguageMessages;
};

export type TranslationShape<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends object
      ? TranslationShape<T[K]>
      : T[K];
};

type Join<K, P> = K extends string
  ? P extends string
    ? `${K}.${P}`
    : never
  : never;

type DotPathsFor<T extends object = RegisteredTranslations> = {
  [K in keyof T]: T[K] extends I18nMessage
    ? K
    : T[K] extends object
      ? Join<K, DotPathsFor<T[K]>>
      : never;
}[keyof T];

export type DotPaths = DotPathsFor;

type EnumMap = Record<string, Record<string, string>>;

type ParseArgType<
  ParamType extends string,
  ParamName extends string,
  Enums extends EnumMap,
> = ParamType extends "number" | "plural"
  ? number
  : ParamType extends "date"
    ? Date
    : ParamType extends "list"
      ? string[]
      : ParamType extends "enum"
        ? ParamName extends keyof Enums
          ? keyof Enums[ParamName]
          : never
        : never;

type ExtractParamArgs<
  S extends string,
  Enums extends EnumMap,
> = S extends `${infer Part1}\\${"{"}${infer Part2}`
  ? ExtractParamArgs<Part1, Enums> & ExtractParamArgs<Part2, Enums>
  : S extends `${infer Part1}\\${"}"}${infer Part2}`
    ? ExtractParamArgs<Part1, Enums> & ExtractParamArgs<Part2, Enums>
    : S extends `${string}{${infer Param}}${infer Rest}`
      ? Param extends `${infer Name}:${infer Type}` // If the string contains a parameter
        ? { [K in Name]: ParseArgType<Type, Name, Enums> } & ExtractParamArgs<
            Rest,
            Enums
          > // If the string contains a parameter with a type
        : { [K in Param]: string } & ExtractParamArgs<Rest, Enums> // If the string has no parameter type
      : unknown; // If the string has no parameters

type TranslationAtKeyWithParams<
  Translations,
  Key extends string,
> = Key extends `${infer First}.${infer Rest}`
  ? First extends keyof Translations
    ? TranslationAtKeyWithParams<Translations[First], Rest>
    : never
  : Key extends keyof Translations
    ? Translations[Key]
    : never;

type NormalizedTranslationAtKey<T> =
  T extends ReturnType<typeof defineTranslation>
    ? T
    : [T, ReturnType<typeof defineTranslation>[1]];

type NormalizedTranslationAtKeyWithParams<Key extends string> =
  NormalizedTranslationAtKey<
    TranslationAtKeyWithParams<RegisteredTranslations, Key>
  >;

type Params<S extends DotPathsFor> = ExtractParamArgs<
  NormalizedTranslationAtKeyWithParams<S>[0] extends string
    ? NormalizedTranslationAtKeyWithParams<S>[0]
    : never,
  NormalizedTranslationAtKeyWithParams<S>[1] extends {
    enum: infer E;
  }
    ? keyof E extends never
      ? EnumMap
      : E
    : EnumMap
>;

type PathsWithParams = {
  [K in DotPathsFor]: keyof Params<K> extends never ? never : K;
}[DotPathsFor];

type PathsWithNoParams = {
  [K in DotPathsFor]: keyof Params<K> extends never ? K : never;
}[DotPathsFor];

export type {
  EnumMap,
  ParseArgType,
  ExtractParamArgs,
  TranslationAtKeyWithParams,
  NormalizedTranslationAtKey,
  NormalizedTranslationAtKeyWithParams,
  Params,
  PathsWithParams,
};

type LazyLanguageMessages = () => Promise<{
  default: LanguageMessages;
}>;

export async function initI18n({
  locale,
  fallbackLocale,
  translations: initialTranslations,
}: {
  locale: string;
  fallbackLocale: string | string[];
  translations: Record<
    Lowercase<string>,
    LanguageMessages | LazyLanguageMessages
  >;
}) {
  const translations = { ...initialTranslations };
  const fallbackLocales = Array.isArray(fallbackLocale)
    ? fallbackLocale
    : [fallbackLocale];

  const orderedLocales = new Set([
    ...getOrderedLocaleAndParentLocales(locale),
    ...fallbackLocales.flatMap(getOrderedLocaleAndParentLocales),
  ]);

  for (const l of orderedLocales) {
    const translation =
      translations[l.toLocaleLowerCase() as Lowercase<string>];

    if (typeof translation === "function") {
      const mod = await translation();
      translations[l.toLocaleLowerCase() as Lowercase<string>] = mod.default;
    }
  }

  function t<S extends PathsWithNoParams>(key: S): string;
  function t<S extends PathsWithParams, A extends Params<S>>(
    key: S,
    args: A,
  ): string;
  function t<S extends DotPathsFor, A extends Params<S>>(key: S, args?: A) {
    for (const locale of orderedLocales) {
      const translationFile =
        translations[locale.toLowerCase() as Lowercase<string>];
      if (translationFile == null) continue;
      const translation = getTranslation(
        locale,
        translationFile as LanguageMessages,
        key,
        args,
      );
      if (translation) return translation;
    }
    return key;
  }

  return {
    t,
  };
}

function getOrderedLocaleAndParentLocales(locale: string) {
  const locales = [];
  let parentLocale = locale;
  while (parentLocale !== "") {
    locales.push(parentLocale);
    parentLocale = parentLocale.replace(/-?[^-]+$/, "");
  }
  return locales;
}

function getTranslation<S extends DotPathsFor, A extends Params<S>>(
  locale: string,
  translations: LanguageMessages,
  key: S,
  args?: A,
) {
  const translation = getTranslationByKey(translations, key);
  const argObj = args ?? {};
  try {
    if (typeof translation === "string") {
      return performSubstitution(locale, translation, argObj, {});
    }

    if (Array.isArray(translation)) {
      const [str, translationParams] = translation;
      return performSubstitution(
        locale,
        str,
        argObj,
        translationParams as ParamOptions,
      );
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function getTranslationByKey(obj: LanguageMessages, key: string) {
  const keys = key.split(".");
  let currentObj = obj;

  for (let i = 0; i <= keys.length - 1; i++) {
    const k = keys[i];

    if (k == null) return undefined;

    const newObj = currentObj[k];
    if (newObj == null) return undefined;

    if (typeof newObj === "string" || Array.isArray(newObj)) {
      if (i < keys.length - 1) return undefined;
      return newObj;
    }

    currentObj = newObj;
  }

  return undefined;
}

function performSubstitution(
  locale: string,
  str: string,
  args: Record<string, unknown>,
  translationParams: ParamOptions,
): string {
  return Object.entries(args).reduce((result, [argKey, argValue]) => {
    const match = result.match(`{${argKey}:?([^}]*)?}`);
    const [replaceKey, argType] = match ? match : [`{${argKey}}`, undefined];

    switch (argType) {
      case "plural": {
        if (typeof argValue !== "number") throw new Error("Invalid argument");
        const pluralMap = translationParams.plural?.[argKey];
        const pluralRules = new Intl.PluralRules(locale, {
          type: pluralMap?.type,
        });

        const replacement =
          pluralMap?.[pluralRules.select(argValue)] ?? pluralMap?.other;

        if (replacement == null) throw new Error("Missing replacement value");
        const numberFormatter = new Intl.NumberFormat(
          locale,
          translationParams.plural?.[argKey]?.formatter,
        );
        return result.replace(
          replaceKey,
          replacement.replace(`{?}`, numberFormatter.format(argValue)),
        );
      }
      case "enum": {
        if (typeof argValue !== "string") throw new Error("Invalid argument");
        const enumMap = translationParams.enum?.[argKey];
        const replacement = enumMap?.[argValue];

        if (replacement == null) throw new Error("Missing replacement value");
        return result.replace(replaceKey, replacement);
      }
      case "number": {
        if (typeof argValue !== "number") throw new Error("Invalid argument");
        const numberFormat = new Intl.NumberFormat(
          locale,
          translationParams.number?.[argKey],
        );

        return result.replace(replaceKey, numberFormat.format(argValue));
      }
      case "list": {
        if (!Array.isArray(argValue)) throw new Error("Invalid argument");

        const formatter = new Intl.ListFormat(
          locale,
          translationParams.list?.[argKey],
        );
        return result.replace(replaceKey, formatter.format(argValue));
      }
      case "date": {
        if (!(argValue instanceof Date)) throw new Error("Invalid argument");

        const dateFormat = new Intl.DateTimeFormat(
          locale,
          translationParams.date?.[argKey],
        );
        return result.replace(replaceKey, dateFormat.format(argValue));
      }
      default:
        return result.replace(replaceKey, String(argValue));
    }
  }, str);
}
