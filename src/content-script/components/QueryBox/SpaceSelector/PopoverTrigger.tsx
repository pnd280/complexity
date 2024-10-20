import { LuX as X } from "react-icons/lu";

import useFetchSpaces from "@/content-script/hooks/useFetchSpaces";
import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import SpaceIcon from "@/shared/components/icons/SpaceIcon";
import { PopoverTrigger } from "@/shared/components/Popover";
import Tooltip from "@/shared/components/Tooltip";
import { cn } from "@/utils/cn";
import { whereAmI } from "@/utils/utils";

type SpaceSelectorPopoverTriggerProps = {
  selectedSpaceUuid: string;
  setSelectedSpaceUuid: (uuid: string) => void;
};

export default function SpaceSelectorPopoverTrigger({
  selectedSpaceUuid,
  setSelectedSpaceUuid,
}: SpaceSelectorPopoverTriggerProps) {
  const { data: spaces } = useFetchSpaces();

  const selectedSpaceTitle = spaces?.find(
    (space) => space.uuid === selectedSpaceUuid,
  )?.title;

  useEffect(() => {
    if (!selectedSpaceTitle) setSelectedSpaceUuid("");
  }, [selectedSpaceTitle, setSelectedSpaceUuid]);

  return (
    <Tooltip content="Chat with a space" disabled={!!selectedSpaceUuid}>
      <PopoverTrigger>
        <div className="text-center cursor-pointer tw-group tw-relative tw-flex tw-min-h-8 tw-max-w-[150px] tw-items-center tw-gap-2 tw-rounded-md tw-px-2 tw-text-sm tw-text-muted-foreground tw-transition-all tw-duration-300 tw-animate-in tw-fade-in hover:tw-bg-accent hover:tw-text-accent-foreground active:tw-scale-95 [&>span]:tw-select-none [&>span]:!tw-truncate">
          {selectedSpaceUuid && (
            <X
              className="!tw-hidden tw-size-4 group-hover:!tw-block"
              onClick={(e) => {
                e.stopPropagation();

                if (whereAmI() === "space") {
                  webpageMessenger.sendMessage({
                    event: "routeToPage",
                    payload: "/",
                  });
                }

                setSelectedSpaceUuid("");
              }}
            />
          )}
          <SpaceIcon
            className={cn("tw-size-4", {
              "group-hover:!tw-hidden": selectedSpaceUuid,
            })}
          />
          {spaces && selectedSpaceUuid ? (
            <span className="tw-max-w-[110px] tw-items-center">
              {selectedSpaceTitle}
            </span>
          ) : null}
        </div>
      </PopoverTrigger>
    </Tooltip>
  );
}
