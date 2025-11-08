import { useCommandMenuStore } from "@/plugins/command-menu/store";
import type { PageStack } from "@/plugins/command-menu/store/slices/pages/types";

export function useCurrentPage(): PageStack | null {
  const pageStack = useCommandMenuStore((store) => store.pagesStack.stack);

  if (pageStack.length === 0) return null;

  const currentPage = pageStack[pageStack.length - 1];

  if (currentPage == null) return null;

  return currentPage;
}
