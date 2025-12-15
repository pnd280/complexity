export type InstantCssSettings = Record<string, InstantCss>;

export type InstantCss = {
  css: string;
  removeAfter?: number;
  enabled?: boolean;
};
