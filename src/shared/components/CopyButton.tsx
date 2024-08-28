import { HTMLAttributes } from "react";
import { LuCheck as Check, LuCopy as Copy } from "react-icons/lu";

import useToggleButtonText from "@/shared/hooks/useToggleButtonText";
import { cn } from "@/utils/cn";

type CopyButtonProps = HTMLAttributes<HTMLDivElement> & {
  content?: string;
  onCopy?: () => void;
  disabled?: boolean;
  iconProps?: HTMLAttributes<SVGElement>;
};

export default function CopyButton({
  content,
  onCopy,
  className,
  disabled,
  iconProps,
  ...props
}: CopyButtonProps) {
  const [copyButtonText, setCopyButtonText] = useToggleButtonText({
    defaultText: <Copy className="tw-size-4" {...iconProps} />,
  });

  return (
    <div
      className={cn(
        "tw-w-max tw-cursor-pointer tw-text-muted-foreground tw-transition-all hover:tw-text-foreground active:tw-scale-95",
        {
          "tw-pointer-events-none tw-opacity-50": disabled,
        },
        className,
      )}
      onClick={() => {
        if (content && !onCopy) {
          navigator.clipboard.writeText(content);
        } else {
          onCopy?.();
        }

        setCopyButtonText(<Check className="tw-size-4" {...iconProps} />);
      }}
      {...props}
    >
      {copyButtonText}
    </div>
  );
}
