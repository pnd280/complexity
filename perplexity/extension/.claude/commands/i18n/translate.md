---
name: i18n-translate
description: "Translate locale files from English (en-US) to target language(s)"
---

# i18n Translate Command

Translate locale files from English (en-US) to target language(s).

## Usage

```
/i18n-translate [language_code] [file_path]
```

**Examples:**

```
/i18n-translate fr-FR src/entrypoints/_locales/en-US.ts
/i18n-translate de-DE src/plugins/artifacts/_locales/en-US.ts
/i18n-translate all src/entrypoints/_locales/en-US.ts  # Translate to all supported languages
```

## Supported Languages

Reference: `.claude/commands/i18n/lang-list.json`

24 languages: bn-BD, cs-CZ, de-DE, el-GR, es-ES, fr-FR, hi-IN, hr-HR, hu-HU, id-ID, it-IT, ja-JP, ko-KR, nl-NL, pl-PL, pt-BR, pt-PT, ro-RO, ru-RU, sk-SK, sr-Cyrl-ME, zh-CN, zh-TW

## File Structure

**Main app:**

```
src/entrypoints/_locales/
├── en-US.ts    # Source of truth
├── fr-FR.ts
├── de-DE.ts
└── ...
```

**Plugins:**

```
src/plugins/{plugin-path}/_locales/
├── en-US.ts    # Source of truth
├── fr-FR.ts
└── ...
```

## Translation Rules

1. **Use en-US as reference** - always translate from English source
2. **Maintain exact structure** - same keys, nesting, object shape
3. **Preserve placeholders:**
   - `{name}`, `{count}`, `{version}` - keep as-is
   - `{?}` in plurals - keep as-is
   - `<0>`, `<1>`, `<0/>` - keep as-is (component markers)
4. **Keep jargon/brand names untranslated** - e.g., "Perplexity", "Pro", "CodeSandbox"
5. **Preserve emojis** - keep emoji placement and type
6. **Escape quotes** - use `\"` for quotes inside strings
7. **Match tone** - friendly, clear, professional

## Workflow

1. **Read target files first** - ALWAYS read each locale file before editing (Edit tool requires this)
2. **Batch reads in parallel** - Read all target locale files simultaneously for efficiency
3. **Then batch edits in parallel** - After reading, apply all edits in a single parallel operation

## Translation Output

- Do NOT output notes/warnings
- For small updates: show only changed portions with location context
- For large files: split across multiple responses if needed
- If no specific language requested: translate to ALL supported languages
