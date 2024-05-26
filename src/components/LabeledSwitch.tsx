import clsx from 'clsx';

import { Label } from './ui/label';
import { Switch } from './ui/switch';

type LabeledSwitchProps = {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
};

export default function LabeledSwitch({
  label,
  onCheckedChange,
  checked,
  labelClassName,
  className,
  disabled,
}: LabeledSwitchProps) {
  return (
    <div className={clsx('tw-flex tw-items-center tw-space-x-2', className)}>
      <Switch
        id="airplane-mode"
        className="[&+label]:data-[state=checked]:tw-text-accent-foreground"
        checked={checked ?? undefined}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
      {label && (
        <Label
          htmlFor="airplane-mode"
          className={clsx(
            'tw-transition-colors tw-duration-150',
            labelClassName
          )}
        >
          {label}
        </Label>
      )}
    </div>
  );
}
