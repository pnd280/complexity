import { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

function Input(
  { className, type, ...props }: InputProps,
  ref: React.Ref<HTMLInputElement>,
): ReactNode {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "tw-flex tw-h-10 tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-py-2 tw-font-sans tw-text-sm tw-ring-offset-background file:tw-border-0 file:tw-bg-transparent file:tw-text-sm file:tw-font-medium placeholder:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50",
        className,
      )}
      {...props}
    />
  );
}

Input.displayName = "Input";

export default forwardRef(Input);
