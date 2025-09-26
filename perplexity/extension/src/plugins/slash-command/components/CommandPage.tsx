import { useCurrentPage } from "@/plugins/slash-command/hooks/useCurrentPage";
import type { SlashCommandPageId } from "@/plugins/slash-command/store/slices/pages/types";

type CommandPageProps = {
  pageId: SlashCommandPageId | null;
  children: React.ReactNode;
};

export default function CommandPage({ pageId, children }: CommandPageProps) {
  const currentPage = useCurrentPage();

  if (currentPage?.pageId != pageId) return null;

  return children;
}
