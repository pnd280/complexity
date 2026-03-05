---
name: i18n-extract
description: "Use when extracting user-facing strings, moving literals into `_locales/en-US.ts`, and rewriting source to `t(...)`, `Trans`, or `dt(...)` translation keys."
disable-model-invocation: true
user-invocable: true
---

# i18n Extract Skill

This skill is **user-invoked only**. Run it only when the user explicitly invokes `/i18n-extract`.

Extract user-facing strings from source files into locale files, then update the source to use translation keys.

This workflow updates `en-US.ts` only unless the user explicitly asks to update other locales too.

## Usage

```bash
/i18n-extract [file_or_directory] [options]
```

## Input Contract

Required input:

- a target file or directory under `src/`

Optional input:

- whether to update non-English locale files afterward
- whether to prefer reuse over new key creation when both are plausible

Defaults:

- update `en-US.ts` only
- keep scope limited to the requested file or directory
- stop and ask when reuse vs new-key choice is genuinely ambiguous

## Locale File Locations

**Main app:**

- Path: `src/entrypoints/_locales/{locale}.ts`
- Namespace: `"common"`

**Plugins:**

- Path: `src/plugins/{plugin-path}/_locales/{locale}.ts`
- Namespace: read the exported `namespace` constant from `src/plugins/{plugin-path}/_locales/index.ts`

## `en-US` Locale File Format

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

Non-English locale files are a separate follow-up step and typically mirror the same shape using the local `Translations` type from `_locales/index.ts`.

## File Inspection Order

Inspect files in this order. Do **not** guess before checking.

1. Target source file(s)
2. Closest target locale namespace file: `_locales/index.ts`
3. Target `en-US.ts`
4. Neighboring source usage of existing keys in the same feature
5. Only then decide reuse vs new key, and formatter choice

## Extraction Rules

1. **DO NOT import `t` or `Trans`** - globally available (auto-imported)
2. **Extract to `en-US` first** - English is source of truth
3. **Use the real namespace** - never infer plugin namespace from folder name; always read `_locales/index.ts`
4. **Use full key path** - format: `namespace.section.key`
5. **Reuse existing keys when semantics match** - search nearby locale sections before adding a new key
6. **Prefer nested semantic keys** - base keys on UI role, not raw English text
7. **Use `t(...)` for plain text**
8. **Only use `Trans`** when the translated string contains component placeholders like `<0>...</0>`
9. **Preserve placeholders exactly** - convert runtime values into `{name}` / `{count:number}` / `{date}` style placeholders
10. **Do not extract non-visible DOM attributes** - skip HTML `aria-label`, `alt`, and DOM `title` attributes
11. **Do extract visible component props** - props like `title`, `label`, `description`, `placeholder`, `message`, `content` may be visible UI text depending on the component
12. **Do not update non-English locale files during extraction** unless the user explicitly asks for that follow-up work

## Key Naming Rules

- Prefer the existing subtree in the target locale file if one already matches the feature.
- Use stable semantic names such as `dialog.confirm.title`, `filters.sort.newest`, `buttons.save`.
- Do **not** create keys directly from the literal English text.
- Do **not** create flat one-off keys when a nested group already exists.
- Reuse an existing key only when the meaning matches, not just the raw text.

## What To Extract

Extract visible user-facing strings from:

- JSX text nodes
- string literals rendered in components
- visible component props such as `label`, `description`, `placeholder`, `message`, `content`, `text`
- menu items, dialog content, toast titles/descriptions, button labels, filter labels, section headings
- strings inside arrays or objects when they are rendered to users

## What To Skip

Skip:

- HTML `aria-label`, `alt`, and DOM `title` attributes
- internal identifiers, enum values, test text, analytics/event names, CSS class names
- URLs, file paths, selectors, storage keys, query parameter names
- strings already passed to `t(...)` or `Trans`

## Formatter Selection Rules

Choose the smallest correct mechanism:

| Case                        | Locale entry                                                      | Source rewrite      |
| --------------------------- | ----------------------------------------------------------------- | ------------------- |
| Static text                 | plain string                                                      | `t(...)`            |
| Simple placeholders         | plain string with `{name}`                                        | `t(..., { name })`  |
| Number/date/list formatting | plain string with `{count:number}`, `{date:date}`, `{items:list}` | `t(..., values)`    |
| Plural grammar              | `dt(...)` with `{count:plural}` rules                             | `t(..., { count })` |
| Enum-dependent wording      | `dt(...)` with `{name:enum}` rules                                | `t(..., { name })`  |
| Embedded JSX/components     | string with `<0>...</0>` placeholders                             | `<Trans ... />`     |

### Use plain strings for

- static copy
- simple runtime variables like `{name}`
- number/date/list formatting such as `{count:number}`, `{date:date}`, `{items:list}`

### Use `dt(...)` for

- `plural` variations
- `enum` variations
- only when locale-specific grammar actually depends on the variable

### Do **not** use `dt(...)` for

- plain `{name}` interpolation
- `{count:number}` / `{date:date}` / `{items:list}` formatting
- JSX/component placeholders handled by `Trans`

## Transformation Rules

### Plain strings

```tsx
<Button>Save</Button>
```

Becomes something like:

```tsx
<Button>{t("common.buttons.save")}</Button>
```

### Interpolated values

```ts
`Expires ${date}`
```

Becomes locale text like:

```ts
expires: "Expires {date}"
```

and source like:

```ts
t("plugin-command-menu.common.expires", { date })
```

### Plural grammar

```ts
limited: dt("{count:plural} left", {
  plural: {
    count: {
      one: "1 use",
      other: "{?} uses",
    },
  },
})
```

and source like:

```ts
t("plugin-model-selectors.languageModelSelector.usesLeft.limited", { count })
```

### Enum grammar

```ts
description: dt("Click to view {name:enum}", {
  enum: {
    name: {
      markdown: "content",
      mermaid: "diagram",
      html: "web page",
    },
  },
})
```

and source like:

```ts
t("plugin-artifacts.placeholder.description", { name: artifactType })
```

### Component placeholders

```tsx
<p>
  Click <a href={url}>here</a> to continue
</p>
```

Becomes locale text like:

```ts
continueMessage: "Click <0>here</0> to continue"
```

and source like:

```tsx
<Trans
  tKey="common.continueMessage"
  components={[<a href={url} />]}
/>
```

## Duplicate And Reuse Strategy

1. Search the target `en-US.ts` file for an existing nearby subtree first.
2. Search the rest of the same locale file for the same English text.
3. Reuse an existing key only if the semantic meaning and grammatical role match.
4. Prefer local namespace reuse over cross-namespace reuse.
5. Do **not** move plugin-specific text into `common` just because the English text looks generic.
6. If no good match exists, add a new nested key in the closest feature subtree.

## Anti-Patterns

### Wrong namespace guess

Bad:

```ts
t("plugin-language-model-selector.tooltip")
```

Good:

```ts
t("plugin-model-selectors.languageModelSelector.tooltip")
```

### Wrong `dt(...)` usage for simple formatting

Bad:

```ts
countLabel: dt("Files ({count:number})", {})
```

Good:

```ts
countLabel: "Files ({count:number})"
```

### Wrong `Trans` usage for plain text

Bad:

```tsx
<Trans tKey="common.buttons.save" />
```

Good:

```tsx
{t("common.buttons.save")}
```

### Wrong skip of visible component props

Bad:

- skipping `<SettingsItem title="Debug" description="Include in bug reports" />`

Good:

- inspect the component semantics first; extract if the prop is visible UI text

## Stop Conditions

Stop and ask the user instead of guessing when:

- the target path is missing, invalid, or outside `src/`
- no matching locale tree or `_locales/index.ts` can be found
- the string is built so dynamically that safe placeholder conversion is unclear
- reuse vs new-key choice would materially change meaning
- it is unclear whether a prop like `title` is a DOM attribute or visible component text after inspecting the component usage
- extraction would require broad restructuring rather than a local i18n rewrite
- the requested directory scope is large enough to create risky bulk churn
- the user appears to want translation of non-English locale files as part of the same step

When you stop, report:

- exact file
- exact string or pattern
- why it is ambiguous
- the smallest decision the user needs to make

## Required Workflow

1. Determine whether the target file belongs to `common` or a plugin locale tree.
2. Open the target `_locales/index.ts` and read the exported `namespace`.
3. Open the target `en-US.ts` locale file.
4. Search the locale file for an existing matching section or reusable key.
5. Decide the correct formatter: plain string, `dt(...)`, or `Trans`.
6. Add new English strings only when no good existing key matches.
7. Rewrite source code to use `t(...)` or `Trans`.
8. Ensure no manual `t` / `Trans` imports were added.
9. Leave non-English locale files untouched unless the user explicitly requested them.
10. Validate the result with typecheck and lint.

## Output Contract

On completion, report these sections:

1. Files changed
2. Keys added
3. Keys reused
4. Strings skipped and why
5. Follow-up needed, if any

If no changes were made, say explicitly:

- no extractable strings found, or
- stopped due to ambiguity and waiting for user input

## Validation Checklist

- Correct locale file updated
- Correct namespace used
- No guessed namespace from folder name
- No manual `t` or `Trans` imports
- Placeholders preserved
- `dt(...)` used for plural/enum cases that need grammar rules
- Plain strings kept for simple number/date/list formatting
- `Trans` used only for component placeholders
- Non-visible DOM attributes skipped
- Visible component props not skipped by mistake
- Non-English locale files untouched unless requested
- `tsc` passes
- `pnpm lint` passes
