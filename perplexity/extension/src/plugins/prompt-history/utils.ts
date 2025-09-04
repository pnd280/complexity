import {
  getActiveQueryBoxTextbox,
  isLexical,
} from "@/plugins/_core/ui/groups/query-box/utils";
import { getPromptHistoryService } from "@/plugins/prompt-history/indexed-db";
import { getTextContent } from "@/utils/lexical-utils";

export const handlePromptSave = async (params?: {
  promptString?: string;
  url?: string;
  type?: "hard" | "soft";
}) => {
  let prompt = params?.promptString;

  if (!params?.promptString) {
    const $activeQueryBoxTextbox = getActiveQueryBoxTextbox();

    if (!$activeQueryBoxTextbox[0]) return;

    if (isLexical($activeQueryBoxTextbox[0])) {
      prompt = getTextContent({
        element: $activeQueryBoxTextbox[0],
        omitDecorators: true,
      });
    } else {
      prompt = $activeQueryBoxTextbox[0].value;
    }
  }

  if (prompt == null || prompt?.length === 0 || prompt.trim() === "") return;

  await getPromptHistoryService().deduplicateAdd({
    prompt,
  });
};
