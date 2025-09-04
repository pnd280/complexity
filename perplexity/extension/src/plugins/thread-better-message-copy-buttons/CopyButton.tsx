import { LuCheck, LuCopy, LuLink2Off, LuLoaderCircle } from "react-icons/lu";

import FaMarkdown from "@/components/icons/FaMarkdown";
import Tooltip from "@/components/Tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useToggleButtonText from "@/hooks/useToggleButtonText";
import { useRegisteredGlobalCssEntry } from "@/plugins/_core/global-stores/global-css-store";
import { useCopyPplxThread } from "@/plugins/export-thread/index.public";

type CopyButtonProps = {
  messageBlockIndex: number;
  hasSources: boolean;
};

type CopyOptions = "with-citations" | "without-citations";

const CopyButton = memo(function CopyButton({
  messageBlockIndex,
  hasSources,
}: CopyButtonProps) {
  const [triggerIcon, setTriggerIcon] = useToggleButtonText({
    defaultText: <LuCopy />,
  });

  const { copyMessage, isFetching } = useCopyPplxThread();

  const handleCopy = useCallback(
    async (withCitations: boolean) => {
      if (isFetching) return;

      await copyMessage({
        messageBlockIndex,
        withCitations,
        onComplete: () => setTriggerIcon(<LuCheck />),
      });
    },
    [copyMessage, isFetching, messageBlockIndex, setTriggerIcon],
  );

  useRegisteredGlobalCssEntry({
    entryIds: ["thread-message-toolbar-hide-native-copy-buttons"],
    subscriberId: "thread-better-message-copy-button#" + messageBlockIndex,
  });

  return (
    <DropdownMenu
      lazyMount
      unmountOnExit
      positioning={{ placement: "bottom-end" }}
      onSelect={({ value }) => {
        handleCopy((value as CopyOptions) === "with-citations");
      }}
    >
      <Tooltip content={t("plugin-better-copy-buttons.tooltip")}>
        <DropdownMenuTrigger asChild>
          <CopyButtonTrigger
            isFetching={isFetching}
            icon={triggerIcon}
            onClick={() => !hasSources && handleCopy(true)}
          />
        </DropdownMenuTrigger>
      </Tooltip>
      {hasSources && (
        <DropdownMenuContent className="x:font-medium">
          <DropdownMenuItem
            value={"with-citations" satisfies CopyOptions}
            className="x:flex x:items-center x:gap-2"
          >
            <FaMarkdown className="x:size-4" />
            <span>{t("plugin-better-copy-buttons.options.default")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            value={"without-citations" satisfies CopyOptions}
            className="x:flex x:items-center x:gap-2"
          >
            <LuLink2Off className="x:size-4" />
            <span>
              {t("plugin-better-copy-buttons.options.withoutCitations")}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
});

type CopyButtonTriggerProps = {
  isFetching: boolean;
  icon: React.ReactNode;
  onClick?: () => void;
};

const CopyButtonTrigger = memo(function CopyButtonTrigger({
  isFetching,
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
        {
          "x:cursor-not-allowed x:opacity-50": isFetching,
        },
      )}
      onClick={onClick}
    >
      {isFetching ? (
        <LuLoaderCircle className="x:size-4 x:animate-spin" />
      ) : (
        icon
      )}
    </div>
  );
});

export default CopyButton;
