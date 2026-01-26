import type { CommandMenuStoreType } from "@/plugins/command-menu/store";
import type { CommandMenuPageId } from "@/plugins/command-menu/store/slices/pages/types";
import type { PageStack } from "@/plugins/command-menu/store/slices/pages/types";
import type { SliceCreator } from "@/types/utils.types";

declare module "@/plugins/command-menu/store" {
  interface CommandMenuStoreType {
    pagesStack: PagesStackSlice;
  }
}

export type PagesStackSlice = {
  stack: PageStack[];
  push: <P extends CommandMenuPageId>(page: PageStack<P>) => void;
  pop: () => PageStack | undefined;
  peek: () => PageStack | undefined;
  reset: () => void;
};

export const createPagesStackSlice: SliceCreator<
  PagesStackSlice,
  CommandMenuStoreType
> = (set, get) => ({
  stack: [],

  push: <PageId extends CommandMenuPageId>(page: PageStack<PageId>) => {
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
      draft.states.shouldLocalFilter = page.shouldLocalFilter;
      draft.states.searchValue =
        page.args != null && "searchValue" in page.args
          ? (page.args.searchValue ?? "")
          : "";
      draft.states.selectingValue = "";
      draft.sidecar.open = page.sidecarOpen;
    });
  },

  pop: () => {
    const currentStack = get().pagesStack.stack;
    if (currentStack.length === 0) return undefined;

    const lastPage = currentStack[currentStack.length - 1];

    const secondLastPage = currentStack[currentStack.length - 2];

    set((draft) => {
      draft.pagesStack.stack = currentStack.slice(0, -1);
      draft.states.searchValue = "";
      draft.states.selectingValue = "";
      draft.states.shouldLocalFilter =
        secondLastPage?.shouldLocalFilter ?? true;
      draft.sidecar.open = secondLastPage?.sidecarOpen ?? false;
    });

    return lastPage;
  },

  peek: () => {
    const currentStack = get().pagesStack.stack;
    return currentStack.length > 0
      ? currentStack[currentStack.length - 1]
      : undefined;
  },

  reset: () => {
    set((draft) => {
      draft.pagesStack.stack = [];
      draft.sidecar.open = false;
      draft.states.shouldLocalFilter = true;
      draft.states.searchValue = "";
      draft.states.selectingValue = "";
    });
  },
});
