import { Highlight } from "@ark-ui/react";
import { LuTrash } from "react-icons/lu";

import CopyButton from "@/components/CopyButton";
import {
  CommandItem,
  CommandItemAlternateRightAttributes,
  CommandItemRightAttributes,
  CommandItemTitle,
} from "@/components/ui/command";
import { slashCommandMenuStore } from "@/plugins/slash-command/index.public";
import { formatRelativeTime } from "@/services/infra/i18n";

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
        <CommandItemTitle className="x:line-clamp-3 x:break-words x:whitespace-pre-wrap">
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
              <LuTrash />
            </div>
          </div>
        </CommandItemAlternateRightAttributes>
      </CommandItem>
    );
  },
);

export default PromptHistoryCommandMenuItem;
