import { Label } from "@/shared/components/shadcn/ui/label";
import { Switch } from "@/shared/components/shadcn/ui/switch";
import { cn } from "@/utils/cn";

type LabeledSwitchProps = {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
  id: string;
  defaultChecked?: boolean;
};

export default function LabeledSwitch({
  label,
  onCheckedChange,
  checked,
  labelClassName,
  className,
  disabled,
  id,
  defaultChecked,
}: LabeledSwitchProps) {
  return (
    <div className={cn("tw-flex tw-items-center tw-space-x-2", className)}>
      <Switch
        id={id}
        className="[&+label]:data-[state=checked]:tw-text-accent-foreground"
        checked={checked ?? undefined}
        disabled={disabled}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
      />
      {label && (
        <Label
          htmlFor={id}
          className={cn("tw-transition-colors tw-duration-150", labelClassName)}
        >
          {label}
        </Label>
      )}
    </div>
  );
}
