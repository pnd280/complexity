import type { SlashCommandPageId } from "@/plugins/__core__/slash-command/store/slices/pages/types";
import type { PageStack } from "@/plugins/__core__/slash-command/store/slices/pages/types";
import type { BoundStateCreator } from "@/plugins/__core__/slash-command/store/types";

export type PagesStackSlice = {
  pageStack: PageStack[];
  pushPage: <P extends SlashCommandPageId>(page: PageStack<P>) => void;
  popPage: () => PageStack | undefined;
  peekPage: () => PageStack | undefined;
  reset: () => void;
};

export const createPagesStackSlice: BoundStateCreator<PagesStackSlice> = (
  set,
  get,
) => ({
  pageStack: [],

  pushPage: <PageId extends SlashCommandPageId>(page: PageStack<PageId>) => {
    const currentStack = get().pageStack;

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

    set({
      pageStack: newStack,
    });
  },

  popPage: () => {
    const currentStack = get().pageStack;
    if (currentStack.length === 0) return undefined;

    const lastPage = currentStack[currentStack.length - 1];

    set({
      pageStack: currentStack.slice(0, -1),
    });

    return lastPage;
  },

  peekPage: () => {
    const currentStack = get().pageStack;
    return currentStack.length > 0
      ? currentStack[currentStack.length - 1]
      : undefined;
  },

  reset: () =>
    set({
      pageStack: [],
    }),
});
