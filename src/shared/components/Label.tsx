import { DetailedHTMLProps, forwardRef, LabelHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

const Label = forwardRef<
  HTMLLabelElement,
  DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "tw-text-sm tw-font-medium tw-leading-none peer-disabled:tw-cursor-not-allowed peer-disabled:tw-opacity-70",
        className,
      )}
      {...props}
    />
  );
});

Label.displayName = "Label";

export default Label;
