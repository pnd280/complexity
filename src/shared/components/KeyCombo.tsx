import { HTMLProps } from "react";

export default function KeyCombo({
  keys,
  ...props
}: HTMLProps<HTMLSpanElement> & { keys: string[] }) {
  return (
    <span className={cn("tw-flex tw-gap-1")} {...props}>
      {keys.map((key) => (
        <span
          key={key}
          className="tw-rounded-sm tw-border tw-px-1 tw-font-mono tw-text-[.7rem]"
        >
          {key}
        </span>
      ))}
    </span>
  );
}
