import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/components/prism-markup.min.js';
import 'prismjs/components/prism-markup-templating.min.js';

import $ from 'jquery';
import Prism from 'prismjs';

import { Nullable } from '@/types/Utils';

import { stripHtml } from './utils';

const importPromises: {
  [K: string]: Nullable<Promise<void>>;
} = {
  markup: Promise.resolve(),
  'markup-templating': Promise.resolve(),
};

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
  'tsx',
  'jsx',
];

const deps: Record<SupportedLang, SupportedLang[]> = {
  cpp: ['c'],
  blade: ['javascript', 'php', 'css'],
  tsx: ['typescript'],
};

const mappedLangs: Record<string, SupportedLang[]> = {
  markup: ['html', 'xml'],
};

type SupportedLang = (typeof supportedLangs)[number];

function isSupportedLang(lang: string): lang is SupportedLang {
  return supportedLangs.includes(lang);
}

async function importComponent(lang: SupportedLang) {
  if (!isSupportedLang(lang)) return;

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

  if (importPromises[mappedImportName]) {
    return importPromises[mappedImportName];
  }

  importPromises[mappedImportName] = (async () => {
    importPromises[mappedImportName] = await import(
      `../utils/prismjs-components/prism-${mappedImportName}.min.js`
    );
  })();

  return importPromises[mappedImportName];
}

async function highlightBlock({ pre, lang }: { pre: Element; lang: string }) {
  if (lang && prismJs.isSupportedLang(lang)) {
    try {
      await prismJs.importComponent(lang);

      const codeElement = $(pre).find('code:first').addClass('line-numbers');
      const code = stripHtml(codeElement.html());

      const newBlock = Prism.highlight(code, Prism.languages[lang], lang);

      codeElement.html(newBlock);
    } catch (err) {
      console.error(`Failed to load Prism language component for ${lang}`, err);
    }
  }
}

const prismJs = {
  isSupportedLang,
  deps,
  supportedLangs,
  importComponent,
  highlightBlock,
};

export default prismJs;
