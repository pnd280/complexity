import { Highlight } from "@ark-ui/react";

import CopyButton from "@/components/CopyButton";
import {
  CommandItem,
  CommandItemAlternateRightAttributes,
  CommandItemRightAttributes,
  CommandItemTitle,
} from "@/components/ui/command";
import { slashCommandMenuStore } from "@/plugins/__core__/slash-command/store";
import { formatRelativeTime } from "@/services/infra/i18n";

import TablerTrash from "~icons/tabler/trash";

type PromptHistoryCommandMenuItem = {
  id: string;
  prompt: string;
  createdAt: string;
  keywords: string[];
};

const PromptHistoryCommandMenuItem = memo(
  ({
    searchValue,
    item,
    onDelete,
  }: {
    searchValue: string;
    item: PromptHistoryCommandMenuItem;
    onDelete: (id: string) => void;
  }) => {
    return (
      <CommandItem
        key={item.id}
        value={item.id}
        keywords={item.keywords}
        className="x:gap-2"
        onSelect={() => {
          slashCommandMenuStore.getState().setBufferText(item.prompt);
          slashCommandMenuStore.getState().setOpen(false);
        }}
      >
        <CommandItemTitle className="x:line-clamp-3 x:wrap-break-word x:whitespace-pre-wrap">
          <Highlight
            ignoreCase
            matchAll
            text={item.prompt.slice(0, 1000)}
            query={searchValue.split(" ")}
          />
        </CommandItemTitle>
        <CommandItemRightAttributes className="x:h-full x:shrink-0 x:text-xs x:text-muted-foreground">
          {formatRelativeTime(item.createdAt)}
        </CommandItemRightAttributes>
        <CommandItemAlternateRightAttributes className="x:h-full x:shrink-0">
          <div className="x:flex x:h-full x:items-center x:gap-2">
            <CopyButton
              data-copy-button
              content={item.prompt}
              iconProps={{ className: "x:size-3" }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
            <div
              className="x:text-muted-foreground x:transition-colors x:hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
            >
              <TablerTrash />
            </div>
          </div>
        </CommandItemAlternateRightAttributes>
      </CommandItem>
    );
  },
);

export default PromptHistoryCommandMenuItem;
