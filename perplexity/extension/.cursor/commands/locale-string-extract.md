---
description:
globs:
alwaysApply: false
---

## Task

1. Extract strings into the specified `{namespace}.{locale}.ts` locale file.
2. Update the code file to match the extracted strings:

- Populate the full key path into the `t(...)` function with the format of `namespace.key.subKey...`.
- For components wrapper, use `Trans` instead of `t`.
- NEVER extract elements that user can NOT see or interact with e.g. `aria-labels`, `alt` attributes, etc.

## IMPORTANT RESTRICTIONS:

- NEVER import any dependencies (`t` or `Trans`), they are globally available.
- ALWAYS use the `t(...)` function directly.
- NEVER import `t` because it is available globally (auto-imported).
- ONLY use `Trans` component for complex translations.
- DO NOT ask for confirmation - just do it.

## TRANSLATION SYNTAXES

### Normal string

## Examples

```ts
import type { LanguageMessages } from "@complexity/i18n";

export default {
  pluginsPage: {
    noPluginsFound: {
      title: "No plugins found",
      description:
        "Try adjusting your search term/filters or <0>request a new one</0> 😉",
    },
  },
} as const satisfies LanguageMessages;
```

```tsx
<div>{t("dashboard-plugins-page.pluginsPage.noPluginsFound.title")}</div>
<Trans
  tKey="dashboard-plugins-page.pluginsPage.noPluginsFound.description"
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
