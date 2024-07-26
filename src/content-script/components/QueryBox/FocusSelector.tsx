import { useToggle } from "@uidotdev/usehooks";
import { Cpu } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { PiGlobeX } from "react-icons/pi";

import { queryBoxStore } from "@/content-script/session-store/query-box";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/shared/components/Select";
import Tooltip from "@/shared/components/Tooltip";
import { cn } from "@/utils/cn";
import UIUtils from "@/utils/UI";

import { type WebAccessFocus, webAccessFocus } from "./";

export default function FocusSelector() {
  const items = useMemo(() => {
    return [...webAccessFocus] as WebAccessFocus[];
  }, []);

  const [open, toggleOpen] = useToggle(false);

  const triggerRef = useRef<HTMLButtonElement>(null);

  const { focus, setFocus, allowWebAccess, toggleWebAccess } = queryBoxStore(
    (state) => state.webAccess,
  );

  useEffect(() => {
    if (allowWebAccess && !focus) {
      setFocus("internet");
    }

    UIUtils.getActiveQueryBoxTextarea({}).trigger("focus");
  }, [allowWebAccess, focus, setFocus]);

  return (
    <Select
      items={items.map((model) => model.code)}
      value={[focus || ""]}
      open={open}
      onValueChange={(details) => {
        setFocus(details.value[0] as WebAccessFocus["code"]);
        toggleWebAccess(true);
        toggleOpen();

        UIUtils.getActiveQueryBoxTextarea({}).trigger("focus");
      }}
      onPointerDownOutside={() => toggleOpen(false)}
    >
      <SelectTrigger
        ref={triggerRef}
        variant="ghost"
        className={cn(
          "gap-1 tw-flex tw-h-full tw-min-h-8 !tw-w-fit tw-max-w-[150px] tw-select-none tw-items-center tw-justify-center !tw-px-2 !tw-py-0 tw-font-medium tw-transition-all tw-duration-300 tw-animate-in tw-zoom-in active:!tw-scale-95 [&_span]:tw-max-w-[100px]",
          {
            "!tw-bg-accent": allowWebAccess,
          },
        )}
        onContextMenu={(e) => {
          e.preventDefault();
          toggleOpen();
        }}
        onClick={() => {
          toggleWebAccess();
        }}
      >
        <Tooltip
          content={`Web access: ${allowWebAccess ? "ON" : "OFF"}${allowWebAccess && focus ? ` | Focus: ${items.find((model) => model.code === focus)?.label}` : ""}`}
          positioning={{
            gutter: 15,
          }}
        >
          <div
            className={cn({
              "tw-text-accent-foreground": allowWebAccess,
            })}
          >
            {allowWebAccess && focus ? (
              <div className="relative">
                {items.find((model) => model.code === focus)?.icon}
              </div>
            ) : (
              <PiGlobeX className="tw-text-[1rem]" />
            )}
          </div>
        </Tooltip>
      </SelectTrigger>
      <SelectContent className="tw-max-h-[500px] tw-min-w-[130px] tw-max-w-[200px] tw-items-center tw-font-sans">
        {items.map((item) => (
          <SelectItem key={item.code} item={item.code}>
            <div className="tw-flex tw-max-w-full tw-items-center tw-justify-around tw-gap-2">
              {item.icon ? (
                <div>{item.icon}</div>
              ) : (
                <Cpu className="tw-size-4" />
              )}
              <span className="tw-truncate">{item.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
