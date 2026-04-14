// Fallback mappings for excluded languages to their common ancestors
// When an excluded language is requested, use the fallback for similar highlighting

export const languageFallbacks: Record<string, string> = {
  // JSON variants -> json
  jsonc: "json",
  json5: "json",
  jsonl: "json",
  jsonnet: "json",
  hjson: "json",

  // XML/HTML variants -> html
  "angular-html": "html",
  "vue-html": "html",
  "html-derivative": "html",
  xsl: "html",
  svg: "html",

  // Shell variants -> bash
  fish: "bash",
  nushell: "bash",
  shellsession: "bash",
  console: "bash",
  zsh: "bash",
  sh: "bash",
  shell: "bash",

  // C-family -> c or cpp
  "objective-cpp": "cpp",
  arduino: "cpp",
  cuda: "cpp",
  hlsl: "cpp",
  glsl: "cpp",
  wgsl: "cpp",
  d: "cpp",
  v: "c",

  // Lisp family -> clojure
  "common-lisp": "clojure",
  lisp: "clojure",
  scheme: "clojure",
  racket: "clojure",
  elisp: "clojure",
  "emacs-lisp": "clojure",
  fennel: "clojure",
  hy: "clojure",

  // ML family -> ocaml or fsharp
  elm: "haskell",
  purescript: "haskell",
  coq: "haskell",
  lean: "haskell",
  lean4: "haskell",

  // Ruby-like
  crystal: "ruby",
  erb: "ruby",

  // Python-like
  mojo: "python",
  cython: "python",
  starlark: "python",

  // JavaScript/TypeScript variants
  "angular-ts": "typescript",
  "ts-tags": "typescript",
  lit: "typescript",
  "glimmer-ts": "typescript",
  "glimmer-js": "javascript",
  coffee: "javascript",
  coffeescript: "javascript",
  imba: "javascript",

  // CSS variants -> css
  stylus: "css",
  postcss: "css",
  styl: "css",

  // Config files -> yaml or toml or ini
  dotenv: "ini",
  properties: "ini",
  desktop: "ini",
  "ssh-config": "ini",
  systemd: "ini",
  nginx: "ini",
  apache: "ini",
  hcl: "yaml",
  kdl: "yaml",
  ron: "json",
  pkl: "yaml",

  // Markup -> markdown
  asciidoc: "markdown",
  adoc: "markdown",
  rst: "markdown",
  mdc: "markdown",
  mdx: "markdown",
  wikitext: "markdown",
  mediawiki: "markdown",
  wiki: "markdown",
  org: "markdown",

  // SQL variants -> sql
  plsql: "sql",
  sparql: "sql",
  kusto: "sql",
  kql: "sql",
  cql: "sql",
  cypher: "sql",

  // Template languages -> html
  blade: "html",
  edge: "html",
  ejs: "html",
  haml: "html",
  handlebars: "html",
  hbs: "html",
  jinja: "html",
  liquid: "html",
  marko: "html",
  pug: "html",
  jade: "html",
  razor: "html",
  twig: "html",
  templ: "html",

  // Assembly -> asm or c
  mipsasm: "c",
  mips: "c",
  riscv: "c",
  llvm: "c",
  wasm: "c",

  // Build/config -> makefile or bash
  cmake: "bash",
  meson: "bash",
  just: "bash",
  bazel: "python",
  beancount: "yaml",

  // Pascal family
  pascal: "c",
  delphi: "c",

  // Fortran -> c-like
  "fortran-fixed-form": "c",
  "fortran-free-form": "c",
  f: "c",
  f90: "c",
  f95: "c",
  f03: "c",

  // Other mappings
  awk: "bash",
  sed: "bash",
  tcl: "bash",
  vb: "csharp",
  vala: "csharp",
  ada: "c",
  cobol: "c",
  abap: "c",
  apex: "java",
  groovy: "java",
  hack: "php",

  // Document formats -> latex or markdown
  tex: "latex",
  bibtex: "latex",
  typst: "markdown",
  typ: "markdown",

  // Data formats
  csv: "json",
  tsv: "json",
  toml: "yaml",

  // Regex
  regex: "javascript",
  regexp: "javascript",
};
