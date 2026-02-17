---
name: i18n-translate
description: "Translate locale files from English (en-US) to target language(s)"
---

# i18n Translate Command

Translate locale strings from one `en-US.ts` file into locale files.

## Usage

```bash
/i18n-translate [language_code|all] [file_path]
```

**Examples**

```bash
/i18n-translate fr-FR src/entrypoints/_locales/en-US.ts
/i18n-translate de-DE src/plugins/artifacts/_locales/en-US.ts
/i18n-translate all src/entrypoints/_locales/en-US.ts
```

## Supported Languages

`bn-BD, cs-CZ, de-DE, el-GR, es-ES, fr-FR, hi-IN, hr-HR, hu-HU, id-ID, it-IT, ja-JP, ko-KR, nl-NL, pl-PL, pt-BR, pt-PT, ro-RO, ru-RU, sk-SK, sr-Cyrl-ME, zh-CN, zh-TW`

## Strict Rules

1. Source of truth is `en-US.ts`.
2. Keep exact object structure and key order.
3. Preserve placeholders exactly: `{name}`, `{count}`, `{version}`, `{?}`, `<0>`, `<1>`, `<0/>`.
4. Keep brand/jargon untranslated: `Perplexity`, `Complexity`, `Pro`, `CodeSandbox`, `Comet`.
5. Preserve emojis and punctuation intent.
6. Do not edit unrelated files.
7. Do not rewrite unchanged keys.

## Execution Protocol (follow exactly)

1. **Parse inputs**
   - `language_code`: one supported locale or `all`.
   - `file_path`: must be an `en-US.ts` locale file.

2. **Validate early**
   - If `file_path` does not end with `/en-US.ts`, stop and ask for correct path.
   - If `language_code` is invalid, stop and ask for a valid code.

3. **Resolve target files (no repo scan)**
   - `locale_dir = dirname(file_path)`
   - If `language_code === all`: targets = all supported languages except `en-US`.
   - Else: targets = `[language_code]`.
   - Target path pattern: `${locale_dir}/{locale}.ts`.

4. **Determine changed keys only**
   - If user message includes a unified diff for `file_path`, use it to scope changed keys.
   - Else, check `git diff -- file_path` once to scope changed keys.
   - If zero changed keys, stop (no edits).

5. **Read phase (minimum I/O)**
   - Read `file_path` once.
   - Read only target locale files that must be updated.
   - Batch all target reads in parallel.

6. **Translate phase**
   - Translate only scoped changed keys.
   - Keep existing target strings for all untouched keys.
   - Keep locale-appropriate tone (friendly, clear, professional).

7. **Rare ambiguity fallback (only when needed)**
   - Trigger only if the changed English text is semantically ambiguous without context.
   - Allow up to **3** extra targeted reads total.
   - Read in this order and stop as soon as meaning is clear:
     1) neighboring keys in `en-US.ts`,
     2) the source file(s) that use the changed translation key,
     3) closely related files in the same feature folder.
   - Keep scope narrow; no broad exploration.

8. **Edit phase (minimum writes)**
   - Edit only files where at least one key changes.
   - One edit batch, in parallel.
   - Do not reformat unrelated lines.

9. **Output**
   - No notes/warnings/explanations.
   - Show changed portions only, with file path + line context.

## Anti-Waste Constraints

- Do **not** read unrelated command/docs files.
- Do **not** glob/search the whole repo when paths are derivable.
- Do **not** edit locale files outside requested target set.
- Do **not** perform full-file retranslation for a small key diff.
- Ambiguity fallback is allowed only under step 7 limits.