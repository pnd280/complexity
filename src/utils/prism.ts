const supportedLangs = [
  'html',
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
];

type SupportedLang = (typeof supportedLangs)[number];

function isLangSupported(lang: string): lang is SupportedLang {
  return supportedLangs.includes(lang);
}

const prismJs = {
  isLangSupported,
};

export default prismJs;
