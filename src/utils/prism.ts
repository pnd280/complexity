import 'prismjs/components/prism-markup.min.js';
import 'prismjs/components/prism-markup-templating.min.js';

const importedLangs = new Set<string>(['markup', 'markup-templating']);

const supportedLangs = [
  'html',
  'xml',
  'javascript',
  'python',
  'csharp',
  'typescript',
  'java',
  'markup',
  'css',
  'clike',
  'bash',
  'c',
  'cpp',
  'gradle',
  'graphql',
  'json',
  'makefile',
  'markdown',
  'powershell',
  'rust',
  'sass',
  'scss',
  'sql',
  'kotlin',
  'haskell',
  'php',
  'apex',
  'blade',
  'mermaid',
];

const deps: Record<SupportedLang, SupportedLang[]> = {
  cpp: ['c'],
  blade: ['javascript', 'php', 'css'],
};

const mappedLangs: Record<string, SupportedLang[]> = {
  markup: ['html', 'xml'],
};

type SupportedLang = (typeof supportedLangs)[number];

function isLangSupported(lang: string): lang is SupportedLang {
  return supportedLangs.includes(lang);
}

async function importComponent(lang: SupportedLang) {
  if (!isLangSupported(lang)) return;

  let mappedImportName = '';

  for (const [key, value] of Object.entries(mappedLangs)) {
    if (value.includes(lang)) {
      mappedImportName = key;
      break;
    }
  }

  if (!mappedImportName) mappedImportName = lang;

  if (mappedImportName in deps) {
    await Promise.all(deps[mappedImportName].map(importComponent));
  }

  if (importedLangs.has(mappedImportName)) return;

  await import(`../utils/prismjs-components/prism-${mappedImportName}.min.js`);

  importedLangs.add(mappedImportName);
}

const prismJs = {
  isLangSupported,
  deps,
  supportedLangs,
  importComponent,
};

export default prismJs;
