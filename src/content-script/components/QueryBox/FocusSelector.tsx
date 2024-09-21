
import { PiQuestionMark } from "react-icons/pi";

import {
  focusModeIcons,
  type FocusMode,
} from "@/content-script/components/QueryBox/";
import { focusModes } from "@/content-script/components/QueryBox/consts";
import { useQueryBoxStore } from "@/content-script/session-store/query-box";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/shared/components/Select";
import Tooltip from "@/shared/components/Tooltip";
import { isReactNode } from "@/types/utils.types";
import { cn } from "@/utils/cn";
import UiUtils from "@/utils/UiUtils";

export default function FocusSelector() {
  const { focusMode, setFocusMode } = useQueryBoxStore((state) => state);

  useEffect(() => {
    UiUtils.getActiveQueryBoxTextarea({}).trigger("focus");
  }, [focusMode]);

  if (!focusMode) return null;

  return (
    <Select
      items={focusModes.map((model) => model.code)}
      value={[(focusMode || "internet") as FocusMode["code"]]}
      onValueChange={(details) => {
        setFocusMode(details.value[0] as FocusMode["code"]);

        UiUtils.getActiveQueryBoxTextarea({}).trigger("focus");
      }}
    >
      <SelectTrigger
        variant="ghost"
        className={cn(
          "gap-1 tw-flex tw-h-full tw-min-h-8 !tw-w-fit tw-max-w-[150px] tw-select-none tw-items-center tw-justify-center !tw-px-2 !tw-py-0 tw-font-medium tw-transition-all tw-duration-300 tw-animate-in tw-fade-in active:!tw-scale-95 [&_span]:tw-max-w-[100px]",
        )}
      >
        <Tooltip
          content={`Focus: ${focusModes.find((model) => model.code === focusMode)?.label}`}
          positioning={{
            gutter: 15,
          }}
        >
          <div className="relative">{focusModeIcons[focusMode]}</div>
        </Tooltip>
      </SelectTrigger>
      <SelectContent className="tw-max-h-[500px] tw-min-w-[130px] tw-max-w-[200px] tw-items-center tw-font-sans">
        {focusModes.map((item) => (
          <SelectItem key={item.code} item={item.code}>
            <div className="tw-flex tw-max-w-full tw-items-center tw-justify-around tw-gap-2">
              {isReactNode(focusModeIcons[item.code]) ? (
                <div>{focusModeIcons[item.code]}</div>
              ) : (
                <PiQuestionMark className="tw-size-4" />
              )}
              <span className="tw-truncate">{item.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
