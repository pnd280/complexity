import { createListCollection } from "@ark-ui/react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectContext,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExportOption } from "@/plugins/_thread/export/export-options";
import { EXPORT_OPTIONS } from "@/plugins/_thread/export/export-options";

type ExportFormatSelectProps = {
  onValueChange?: (value: ExportOption["value"]) => void;
};

export function ExportFormatSelect({ onValueChange }: ExportFormatSelectProps) {
  return (
    <div>
      <Label className="x:text-xs x:text-muted-foreground">
        {t("plugin-thread-export.format.label")}
      </Label>

      <Select
        defaultValue={["markdown"]}
        collection={createListCollection<ExportOption>({
          items: EXPORT_OPTIONS,
          itemToString(item) {
            return item.label;
          },
          isItemDisabled(value) {
            const typedValue = value as unknown as string;
            return (
              EXPORT_OPTIONS.find((option) => option.value === typedValue)
                ?.isDisabled ?? false
            );
          },
        })}
        positioning={{
          sameWidth: true,
        }}
        onValueChange={({ value }) =>
          onValueChange?.(value[0] as ExportOption["value"])
        }
      >
        <SelectContext>
          {({ value }) => (
            <SelectTrigger variant="default" className="x:w-full x:p-2">
              {(() => {
                const selectedOption = EXPORT_OPTIONS.find(
                  (option) => option.value === value[0],
                );
                return selectedOption ? (
                  <div className="x:flex x:items-center x:gap-2">
                    <selectedOption.icon className="x:size-4" />
                    <span>{selectedOption.label}</span>
                  </div>
                ) : (
                  <SelectValue
                    placeholder={t("plugin-thread-export.format.placeholder")}
                  />
                );
              })()}
            </SelectTrigger>
          )}
        </SelectContext>
        <SelectContent>
          {EXPORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} item={option.value}>
              <div className="x:flex x:items-center x:gap-2">
                <option.icon className="x:size-4" />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
