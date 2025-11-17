import type { SlashCommandMenuStoreType } from "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/store";
import type { SlashCommandPageId } from "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/store/slices/pages/types";
import type { PageStack } from "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/store/slices/pages/types";
import type { SliceCreator } from "@/types/utils.types";

declare module "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/store" {
  interface SlashCommandMenuStoreType {
    pagesStack: PagesStackSlice;
  }
}

export type PagesStackSlice = {
  stack: PageStack[];
  pushPage: <P extends SlashCommandPageId>(page: PageStack<P>) => void;
  popPage: () => PageStack | undefined;
  peekPage: () => PageStack | undefined;
  reset: () => void;
};

export const createPagesStackSlice: SliceCreator<
  PagesStackSlice,
  SlashCommandMenuStoreType
> = (set, get) => ({
  stack: [],

  pushPage: <PageId extends SlashCommandPageId>(page: PageStack<PageId>) => {
    const currentStack = get().pagesStack.stack;

    if (
      currentStack.length > 0 &&
      currentStack[currentStack.length - 1]?.pageId === page.pageId
    ) {
      return;
    }

    let newStack = [...currentStack];

    const existingIndex = currentStack.findIndex(
      (p) => p.pageId === page.pageId,
    );

    if (existingIndex !== -1) {
      newStack = [
        ...currentStack.slice(0, existingIndex),
        ...currentStack.slice(existingIndex + 1),
      ];
    }

    newStack.push(page as PageStack);

    set((draft) => {
      draft.pagesStack.stack = newStack;
    });
  },

  popPage: () => {
    const currentStack = get().pagesStack.stack;
    if (currentStack.length === 0) return undefined;

    const lastPage = currentStack[currentStack.length - 1];

    set((draft) => {
      draft.pagesStack.stack = currentStack.slice(0, -1);
    });

    return lastPage;
  },

  peekPage: () => {
    const currentStack = get().pagesStack.stack;
    return currentStack.length > 0
      ? currentStack[currentStack.length - 1]
      : undefined;
  },

  reset: () =>
    set((draft) => {
      draft.pagesStack.stack = [];
    }),
});
