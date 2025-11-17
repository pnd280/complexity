import Tooltip from "@/components/Tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRegisteredGlobalCssEntry } from "@/entrypoints/contexts/content-scripts/stores/global-css-store";
import useToggleButtonText from "@/hooks/useToggleButtonText";
import { useCopyPplxThread } from "@/plugins/_thread/export/index.public";

import TablerCheck from "~icons/tabler/check";
import TablerCopy from "~icons/tabler/copy";
import TablerLinkOff from "~icons/tabler/link-off";
import TablerMarkdown from "~icons/tabler/markdown";

type CopyButtonProps = {
  messageBlockIndex: number;
  hasSources: boolean;
};

type CopyOptions = "with-citations" | "without-citations";

export default function CopyButton({
  messageBlockIndex,
  hasSources,
}: CopyButtonProps) {
  const [triggerIcon, setTriggerIcon] = useToggleButtonText({
    defaultText: <TablerCopy className="x:size-3.5" />,
  });

  const { copyMessage } = useCopyPplxThread();

  useRegisteredGlobalCssEntry({
    entryIds: ["thread-message-footer-hide-native-copy-buttons"],
    subscriberId: "thread-better-message-copy-button#" + messageBlockIndex,
  });

  return (
    <DropdownMenu
      lazyMount
      unmountOnExit
      positioning={{ placement: "bottom-end" }}
      onSelect={async ({ value }) => {
        await copyMessage({
          messageBlockIndex,
          withCitations: (value as CopyOptions) === "with-citations",
        });

        setTriggerIcon(<TablerCheck className="x:size-3.5" />);
      }}
    >
      <Tooltip content={t("plugin-better-copy-buttons.tooltip")}>
        <DropdownMenuTrigger asChild>
          <CopyButtonTrigger
            icon={triggerIcon}
            onClick={async () => {
              if (hasSources) return;

              await copyMessage({
                messageBlockIndex,
                withCitations: true,
              });

              setTriggerIcon(<TablerCheck className="x:size-3.5" />);
            }}
          />
        </DropdownMenuTrigger>
      </Tooltip>
      {hasSources && (
        <DropdownMenuContent className="x:font-medium">
          <DropdownMenuItem
            value={"with-citations" satisfies CopyOptions}
            className="x:flex x:items-center x:gap-2"
          >
            <TablerMarkdown className="x:size-4" />
            <span>{t("plugin-better-copy-buttons.options.default")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            value={"without-citations" satisfies CopyOptions}
            className="x:flex x:items-center x:gap-2"
          >
            <TablerLinkOff className="x:size-4" />
            <span>
              {t("plugin-better-copy-buttons.options.withoutCitations")}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}

type CopyButtonTriggerProps = {
  icon: React.ReactNode;
  onClick?: () => void;
};

function CopyButtonTrigger({
  icon,
  onClick,
  ...props
}: CopyButtonTriggerProps & { asChild?: boolean }) {
  return (
    <div
      {...props}
      tabIndex={0}
      className={cn(
        "x:cursor-pointer x:rounded-full x:p-2 x:text-muted-foreground x:transition-all x:hover:bg-muted/50 x:hover:text-foreground x:active:scale-95",
      )}
      onClick={onClick}
    >
      {icon}
    </div>
  );
}
