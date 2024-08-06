import { LayoutGrid, X } from "lucide-react";

import { Collection } from "@/content-script/components/QueryBox/CollectionSelector/CollectionSelector";
import { PopoverTrigger } from "@/shared/components/Popover";
import Tooltip from "@/shared/components/Tooltip";
import { cn } from "@/utils/cn";

type CollectionSelectorPopoverTriggerProps = {
  selectedCollectionUuid: string;
  collections: Collection[] | undefined;
  setSelectedCollectionUuid: (uuid: string) => void;
};

export default function CollectionSelectorPopoverTrigger({
  selectedCollectionUuid,
  collections,
  setSelectedCollectionUuid,
}: CollectionSelectorPopoverTriggerProps) {
  return (
    <Tooltip
      content="Chat with a collection"
      disabled={!!selectedCollectionUuid}
    >
      <PopoverTrigger asChild>
        <div className="text-center cursor-pointer tw-group tw-relative tw-flex tw-min-h-8 tw-max-w-[150px] tw-items-center tw-gap-2 tw-rounded-md tw-px-2 tw-text-sm tw-text-muted-foreground tw-transition-all tw-duration-300 tw-animate-in tw-fade-in hover:tw-bg-accent hover:tw-text-accent-foreground active:tw-scale-95 [&>span]:tw-select-none [&>span]:!tw-truncate">
          {selectedCollectionUuid && (
            <X
              className="!tw-hidden tw-size-4 group-hover:!tw-block"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCollectionUuid("");
              }}
            />
          )}
          <LayoutGrid
            className={cn("tw-size-4", {
              "group-hover:!tw-hidden": selectedCollectionUuid,
            })}
          />
          {collections && selectedCollectionUuid ? (
            <span className="tw-max-w-[110px] tw-items-center">
              {
                collections.find(
                  (collection) => collection.uuid === selectedCollectionUuid,
                )?.title
              }
            </span>
          ) : null}
        </div>
      </PopoverTrigger>
    </Tooltip>
  );
}
