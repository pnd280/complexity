## Task

1. Extract strings into the specified `{namespace}.{locale}.ts` locale file.
2. Update the code file to match the extracted strings:

- Populate the full key path into the `t(...)` function with the format of `namespace.key.subKey...`.
- For components wrapper, use `Trans` instead of `t`.
- NEVER extract elements that user can NOT see or interact with e.g. `aria-labels`, `alt` attributes, etc.

## IMPORTANT RESTRICTIONS:

- NEVER import any dependencies (`t` or `Trans`), they are auto-imported and globally available.
- ALWAYS use the `t(...)` function directly.
- ONLY use `Trans` for translations with component placeholders.

## TRANSLATION SYNTAXES

## Examples

```ts
import type { LanguageMessages } from "@complexity/i18n";

export default {
  noPluginsFound: {
    title: "No plugins found",
    description:
      "Try adjusting your search term/filters or <0>request a new one</0> 😉",
  },
} as const satisfies LanguageMessages;
```

```tsx
<div>{t("noPluginsFound.title")}</div>
<Trans
  tKey="noPluginsFound.description"
  components={[
    <a
      href="#"
      className="tw-underline tw-transition-colors hover:tw-text-foreground"
      target="_blank"
      rel="noreferrer"
    />,
  ]}
/>
```
