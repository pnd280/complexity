import type { ComponentProps } from "react";

import useToggleButtonText from "@/hooks/useToggleButtonText";

import TablerCheck from "~icons/tabler/check";
import TablerCopy from "~icons/tabler/copy";

type CopyButtonProps = ComponentProps<"div"> & {
  content?: string;
  onCopy?: () => void;
  disabled?: boolean;
  iconProps?: ComponentProps<"svg">;
};

export default function CopyButton({
  content,
  onCopy,
  className,
  disabled,
  iconProps,
  onClick,
  ...props
}: CopyButtonProps) {
  const [copyButtonText, setCopyButtonText] = useToggleButtonText({
    defaultText: (
      <TablerCopy
        {...iconProps}
        className={cn("x:size-4", iconProps?.className)}
      />
    ),
  });

  return (
    <div
      className={cn(
        "x:w-max x:cursor-pointer x:text-muted-foreground x:transition-all x:hover:text-foreground x:active:scale-95",
        {
          "x:pointer-events-none x:opacity-50": disabled,
        },
        className,
      )}
      onClick={(e) => {
        if (content && !onCopy) {
          void navigator.clipboard.writeText(content);
        } else {
          onCopy?.();
        }

        setCopyButtonText(
          <TablerCheck
            {...iconProps}
            className={cn("x:size-4", iconProps?.className)}
          />,
        );

        onClick?.(e);
      }}
      {...props}
    >
      {copyButtonText}
    </div>
  );
}
