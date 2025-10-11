import FaMarkdown from "@/components/icons/FaMarkdown";
import Tooltip from "@/components/Tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useToggleButtonText from "@/hooks/useToggleButtonText";
import { useRegisteredGlobalCssEntry } from "@/plugins/__async-deps__/global-stores/global-css-store";
import { useCopyPplxThread } from "@/plugins/thread-export/index.public";

import TablerCheck from "~icons/tabler/check";
import TablerCopy from "~icons/tabler/copy";
import TablerLinkOff from "~icons/tabler/link-off";
import TablerLoaderCircle from "~icons/tabler/loader-2";

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
    defaultText: <TablerCopy className="x:size-3.5" />,
  });

  const { copyMessage, isFetching } = useCopyPplxThread();

  const handleCopy = useCallback(
    async (withCitations: boolean) => {
      if (isFetching) return;

      await copyMessage({
        messageBlockIndex,
        withCitations,
        onComplete: () =>
          setTriggerIcon(<TablerCheck className="x:size-3.5" />),
      });
    },
    [copyMessage, isFetching, messageBlockIndex, setTriggerIcon],
  );

  useRegisteredGlobalCssEntry({
    entryIds: ["thread-message-footer-hide-native-copy-buttons"],
    subscriberId: "thread-better-message-copy-button#" + messageBlockIndex,
  });

  return (
    <DropdownMenu
      lazyMount
      unmountOnExit
      positioning={{ placement: "bottom-end" }}
      onSelect={({ value }) => {
        void handleCopy((value as CopyOptions) === "with-citations");
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
            <TablerLinkOff className="x:size-4" />
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
        <TablerLoaderCircle className="x:size-4 x:animate-spin" />
      ) : (
        icon
      )}
    </div>
  );
});

export default CopyButton;
