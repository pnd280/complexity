---
name: i18n-extract
description: "Extract user-facing strings from source files to locale files and update source to use translation keys"
---

# i18n Extract Command

Extract user-facing strings from source files into locale files, then update the source to use translation keys.

## Usage

```
/i18n-extract [file_or_directory] [options]
```

## Locale File Locations

**Main app:**
- Path: `src/entrypoints/_locales/{locale}.ts`
- Namespace: `"common"`

**Plugins:**
- Path: `src/plugins/{plugin-path}/_locales/{locale}.ts`
- Namespace: `"plugin-{plugin-name}"` (defined in `_locales/index.ts`)

## Locale File Format

```ts
import type { LanguageMessages } from "@complexity/i18n";

export default {
  keyName: "Simple string",
  nested: {
    key: "Nested value",
    withParam: "Hello {name}",
    withComponent: "Click <0>here</0> to continue",
  },
} as const satisfies LanguageMessages;
```

**Dynamic translations (plurals, enums):**

```ts
import { dt, type LanguageMessages } from "@complexity/i18n";

export default {
  count: dt("{count:plural} items", {
    plural: {
      count: {
        one: "1 item",
        other: "{?} items",
      },
    },
  }),
  type: dt("View {type:enum}", {
    enum: {
      type: {
        image: "image",
        video: "video",
      },
    },
  }),
} as const satisfies LanguageMessages;
```

## Code Usage

**Simple strings:**

```tsx
// Full key path: namespace.key.subKey
{t("common.sidebar.title")}
{t("plugin-artifacts.toggle.preview")}

// With parameters:
{t("common.releaseNotes.title", { version: "1.0" })}
```

**With component placeholders (`<0/>`, `<1/>`, etc.):**

```tsx
<Trans
  tKey="common.sponsorDialog.cometAffiliate.title"
  components={[<SubscriptionBadge />]}
/>

// For text wrapping: <0>text</0>
<Trans
  tKey="namespace.key.withLink"
  components={[
    <a href="#" className="tw-underline" />,
  ]}
/>
```

## Extraction Rules

1. **DO NOT import `t` or `Trans`** - globally available (auto-imported)
2. **NEVER extract non-visible elements** - skip `aria-label`, `alt`, `title` attributes
3. **Use full key path** - format: `namespace.key.subKey`
4. **Only use `Trans`** for strings with component placeholders
5. **Match existing namespace** - check `_locales/index.ts` for namespace name
6. **Extract to en-US first** - English is source of truth
