import { HTMLAttributes } from "react";

import Input from "@/shared/components/Input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/shared/components/Select";

type AccentColorSelectorProps = HTMLAttributes<HTMLInputElement> & {
  color?: string;
  setColor: (value: string) => void;
};

const predefinedColors = [
  { name: "Default (only dark)", value: "", colorScheme: "dark" },
  { name: "Middle Blue", value: "#7ed6df", colorScheme: "dark" },
  { name: "Light Greenish Blue", value: "#55efc4", colorScheme: "dark" },
  { name: "Shy Moment", value: "#a29bfe", colorScheme: "dark" },
  { name: "Sour Lemon", value: "#ffeaa7", colorScheme: "dark" },
  { name: "Greenland Green", value: "#22a6b3", colorScheme: "light" },
  { name: "Mint Leaf", value: "#00b894", colorScheme: "light" },
  { name: "Exodus Fruit", value: "#6c5ce7", colorScheme: "light" },
  { name: "Bright Yarrow", value: "#fdcb6e", colorScheme: "light" },
] as const;

type Color = (typeof predefinedColors)[number];

const groupedColorsByScheme = Array.from(
  predefinedColors.reduce((acc: Map<string, Color[]>, color) => {
    const group = acc.get(color.colorScheme) || [];
    group.push(color);
    return acc.set(color.colorScheme, group);
  }, new Map<string, Color[]>()),
);

export default forwardRef<HTMLInputElement, AccentColorSelectorProps>(
  function AccentColorSelector({ color, setColor, ...props }, ref) {
    const defaultColor = color || "#72aefd";

    return (
      <div className="tw-flex tw-gap-2">
        <Select
          items={predefinedColors}
          value={[defaultColor]}
          onValueChange={({ value }) => {
            setColor(value[0]);
          }}
        >
          <SelectTrigger>
            <div
              className="tw-w-[100px] tw-self-stretch tw-rounded-md tw-border tw-border-border tw-transition-all"
              style={{
                backgroundColor: defaultColor,
              }}
            />
          </SelectTrigger>
          <SelectContent className="tw-font-sans">
            {groupedColorsByScheme.map(([scheme, colors]) => (
              <SelectGroup key={scheme}>
                <SelectLabel>
                  {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                </SelectLabel>
                {colors.map((color) => (
                  <SelectItem
                    key={color.value}
                    item={color.value}
                    className="tw-flex tw-h-8 tw-items-center tw-gap-2"
                  >
                    <div
                      className="tw-my-2 tw-h-4 tw-w-4 tw-cursor-pointer tw-rounded-md tw-border tw-border-border tw-transition-all"
                      style={{ backgroundColor: color.value || "#72aefd" }}
                    />
                    {color.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
        <Input
          ref={ref}
          id="accent-color"
          placeholder="#72aefd (default dark)"
          {...props}
        />
      </div>
    );
  },
);
