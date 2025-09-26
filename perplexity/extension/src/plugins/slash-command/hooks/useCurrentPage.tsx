import { useSlashCommandMenuStore } from "@/plugins/slash-command/store";
import type { PageStack } from "@/plugins/slash-command/store/slices/pages/types";

export function useCurrentPage(): PageStack | null {
  const pageStack = useSlashCommandMenuStore((state) => state.pageStack);

  if (pageStack.length === 0) return null;

  const currentPage = pageStack[pageStack.length - 1];

  if (currentPage == null) return null;

  return currentPage;
}
