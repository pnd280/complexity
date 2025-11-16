export interface SlashCommandPagesArgsRegistry {}

export type SlashCommandPageId = keyof SlashCommandPagesArgsRegistry;

export type PageStack<PageId extends SlashCommandPageId = SlashCommandPageId> =
  {
    [K in PageId]: {
      pageId: K;
      args: SlashCommandPagesArgsRegistry[K];
    };
  }[PageId];
