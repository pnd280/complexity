---
name: i18n-translate
description: "Use when translating changed keys from `_locales/en-US.ts` into one or more sibling locale files while preserving structure, placeholders, tags, and product terms."
disable-model-invocation: true
user-invocable: true
---

# i18n Translate Skill

This skill is **user-invoked only**. Run it only when the user explicitly invokes `/i18n-translate`.

Translate changed locale strings from one `en-US.ts` file into sibling locale files.

## Objective

Safely update only the requested existing sibling locale files for messages changed in one `en-US.ts` file without breaking structure, imports, placeholders, tags, or `dt(...)` syntax.

## Success Criteria

- Only the requested existing sibling locale files are edited.
- Only changed message keys are translated or inserted.
- Placeholders, tags, imports, typing, and `dt(...)` structures remain valid.
- The final report is concise, complete, and uses the required output headings.

## Non-Goals

- Do not translate the whole file.
- Do not create new locale files.
- Do not modify the source `en-US.ts` file.
- Do not sync deletions or renames unless the user explicitly asks for cleanup sync.
- Do not normalize formatting or import style beyond the minimum needed for valid `dt(...)` usage.

## Usage

```bash
/i18n-translate [language_code|all] [file_path]
```

## Input Contract

Required input:

- target language code or `all`
- path to a source locale file ending in `en-US.ts`

Optional input:

- explicit changed key paths
- explicit diff base or commit range when the working tree diff is not the intended scope

Defaults:

- translate changed keys only
- resolve targets from the source file's directory only
- update existing sibling locale files only
- proceed autonomously only when the target set, changed-key scope, and source meaning are unambiguous
- stop and ask instead of guessing when scope or meaning is unclear

## Supported Languages

`bn-BD, cs-CZ, de-DE, el-GR, es-ES, fr-FR, hi-IN, hr-HR, hu-HU, id-ID, it-IT, ja-JP, ko-KR, nl-NL, pl-PL, pt-BR, pt-PT, ro-RO, ru-RU, sk-SK, sr-Cyrl-ME, zh-CN, zh-TW`

## Target File Conventions

- Source `en-US.ts` files typically end with `as const satisfies LanguageMessages`.
- Sibling locale files typically end with `as const satisfies Translations` and import `Translations` from the local `_locales` index module.
- Some sibling locale files also import `dt` from `@complexity/i18n` when any translated entry uses `dt(...)`.
- Preserve the existing import style and order, including whether the file uses `_locales` or `_locales/index` in the import path. Only touch imports when a newly added or updated `dt(...)` entry requires it.

## Autonomy Rules

- Proceed without asking only when the changed keys, target files, and source meaning are all clear.
- If any required target file is missing, any changed key cannot be mapped safely, or the English meaning is context-dependent, stop and ask.
- When you ask, request the smallest possible decision instead of dumping broad uncertainty back on the user.

## File Scope Rules

1. Source of truth is `en-US.ts`.
2. Only inspect `en-US.ts` plus target sibling locale files.
3. Never read or edit locale files outside `dirname(file_path)`.
4. Never edit unrelated source files, docs, or non-target locale files.
5. If `all` is requested, target every supported sibling locale file except `en-US.ts` that already exists in the same directory.

## Translation Rules

1. Keep exact object structure, nesting, and key order.
2. Translate only changed keys. Leave unchanged keys untouched.
3. Preserve placeholders exactly: `{name}`, `{count}`, `{version}`, `{?}`, `<0>`, `<1>`, `<0/>`.
4. Preserve non-message syntax exactly: imports, object keys, `dt(...)`, rule names, braces, commas, comments, `as const`, `satisfies`, and type annotations.
5. For `dt(...)` entries, translate every string leaf inside the rule object. Do not change selector names, branch structure, or interpolation markers.
6. Keep brand/jargon untranslated: `Perplexity`, `Complexity`, `Pro`, `CodeSandbox`, `Comet`.
7. Preserve emojis, capitalization intent, punctuation intent, and placeholder ordering.
8. Match the existing tone and terminology already used in each target locale file.
9. Prefer natural UI phrasing in the target language. Do not force literal word-for-word translations.
10. Do not bulk-add, rename, reorder, or reformat keys. Only add a missing changed key when it exists in `en-US.ts` and is absent in the target file.
11. Do not delete target keys during this workflow. If the English diff includes removals or renames, report them as skipped unless the user explicitly asked for cleanup sync.
12. Do not create formatting churn, comments, or unrelated edits.
13. Preserve the existing quoting style, import path form, and multiline layout unless a minimal local edit requires otherwise.

## Syntax Preservation Examples

- Plain placeholder: `"Updated to v{version}"` → translate the message only; keep `{version}` exactly.
- Component tag: `"Try Comet - Get a free <0/> subscription!"` → translate the message only; keep `<0/>` exactly.
- `dt(...)` entry: translate the human-readable strings inside the rule object, but keep the `plural` / `enum` structure unchanged.

## Entry Classification

- Plain string: translate the string literal only.
- Tagged string: translate the human-readable text only; preserve tag indices and self-closing tags exactly.
- `dt(...)` entry: translate every user-facing string leaf inside the rule object; do not rewrite selectors, variable names, or branch keys.

## Changed-Key Detection

1. If the user provides explicit changed keys, use them.
2. Otherwise, derive changed keys from the message diff or `git diff -- file_path`.
3. Treat changed leaf messages as the unit of work. For `dt(...)` entries, treat the whole `dt(...)` entry as changed and translate all of its string leaves.
4. Ignore pure formatting, import-only, comment-only, or type-only churn in `en-US.ts`.
5. If filtering leaves zero message changes, report `no changed keys detected` and stop.
6. If the changed-key scope cannot be determined safely, stop and ask.
7. Never translate the whole file just because it is easier.

## Diff Resolution Rules

1. If the user provides an explicit diff base or commit range, use that instead of the working tree diff.
2. If the user provides explicit changed keys, prefer that scope over any inferred diff.
3. If diff output shows only removals or renames, report them as skipped unless the user explicitly asked for cleanup sync.
4. If diff output includes both editable changes and removals or renames, translate the editable changes and report the removals or renames separately.

## Target Resolution Rules

1. Validate the requested locale code against the supported language list, unless the user requested `all`.
2. Resolve target files from `dirname(file_path)` only.
3. For a single target locale, require that sibling locale file to exist. If it does not exist, stop and report it.
4. For `all`, update only the sibling locale files that already exist and are supported.
5. For `all`, do not create missing supported locale files; mention them under files skipped only if that information is relevant to the outcome.

## Execution Protocol

1. Validate that `basename(file_path)` is `en-US.ts`.
2. Validate locale code or `all`.
3. Resolve targets from `dirname(file_path)` only.
4. Determine changed keys from explicit user scope or the intended diff base.
5. Classify each changed entry before editing: plain string, tagged string, or `dt(...)` entry.
6. Read the source file once and read only the target locale files. MUST.
7. Translate only changed keys.
8. If a changed key is missing in a target file, add only that key in the matching structural position from `en-US.ts`.
9. If a target file newly needs `dt(...)`, update its imports minimally and preserve the file's existing import style.
10. Skip removals or renames unless the user explicitly asked for cleanup sync.
11. Rare ambiguity fallback: max 3 targeted follow-up reads. If ambiguity remains, stop and ask.
12. Edit only files with real translation updates.
13. When reporting results, output changed portions only; do not echo full locale files.
14. Validate the result against the checklist before reporting completion.

## Stop Conditions

Stop and ask instead of guessing when:

- `file_path` is invalid, missing, or its basename is not `en-US.ts`
- the locale code is unsupported
- the changed-key scope is unavailable or ambiguous
- a requested single-language target file does not exist
- a changed entry is not a plain string, tagged string, or `dt(...)` entry that can be translated safely
- the diff includes removals, moves, or renames that cannot be mapped to target keys safely
- placeholders, tags, or `dt(...)` branches are ambiguous enough to risk corrupting syntax
- the target locale file diverges structurally enough that safe key-level editing is unclear
- the source English is itself unclear or context-dependent enough to make the translation unreliable

When you stop, report:

- exact file
- exact key or pattern
- why it is ambiguous
- the smallest user decision needed

## Output Contract

On completion, use exactly these Markdown headings:

## Files changed

## Languages updated

## Keys translated

## Keys skipped and why

## Files skipped and why

## Follow-up needed

Report content rules:

- `## Files changed`: list only files actually edited.
- `## Languages updated`: list only languages that received real translation updates.
- `## Keys translated`: list changed key paths grouped clearly by file or language.
- `## Keys skipped and why`: include removals, renames, ambiguous keys, or unsupported entry types.
- `## Files skipped and why`: include missing requested target files or intentionally uncreated files when relevant.
- `## Follow-up needed`: write `none` when no further action is needed.

If no changes were made, say explicitly:

- no changed keys detected, or
- stopped due to ambiguity and waiting for user input

## Validation Checklist

- Only the requested target locale files were edited.
- No new locale files were created.
- The source `en-US.ts` file was not modified.
- Unchanged keys were left untouched.
- Placeholders, tags, and placeholder ordering were preserved exactly.
- `dt(...)` structures were preserved and imports remain valid.
- `dt` imports were added or left alone only when required by translated entries.
- Unrelated imports, comments, and formatting were left alone.
- Existing import path form and type-only import usage were preserved unless a minimal valid edit required change.
- File-level typing such as `satisfies LanguageMessages` / `satisfies Translations` remains intact.
- Missing changed keys were inserted only in the matching structural position.
- Removed or renamed English keys were reported instead of guessed.
