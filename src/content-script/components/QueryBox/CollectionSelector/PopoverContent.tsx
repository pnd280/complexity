import {
  LuLoader2 as LoaderCircle,
  LuPause as Pause,
  LuPencil as Pencil,
  LuPlay as Play,
  LuExternalLink as ExternalLink,
} from "react-icons/lu";

import useFetchCollections from "@/content-script/hooks/useFetchCollections";
import useFetchUserAiProfile from "@/content-script/hooks/useFetchUserAiProfile";
import useUpdateUserAiProfile from "@/content-script/hooks/useUpdateUserAiProfile";
import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandSeparator,
  CommandItem,
} from "@/shared/components/Command";
import { PopoverContent } from "@/shared/components/Popover";
import Tooltip from "@/shared/components/Tooltip";
import { Collection } from "@/types/collection.types";
import { cn } from "@/utils/cn";

type CollectionSelectorPopoverContentProps = {
  selectedCollectionUuid: string;
  setSelectedCollectionUuid: (uuid: string) => void;
  toggleEditUserProfileDialog: () => void;
  setEditCollection: (collection: Collection | undefined) => void;
  setOpen: (open: boolean) => void;
};

export function CollectionSelectorPopoverContent({
  selectedCollectionUuid,
  setSelectedCollectionUuid,
  toggleEditUserProfileDialog,
  setEditCollection,
  setOpen,
}: CollectionSelectorPopoverContentProps) {
  const { data: collections, isLoading: isLoadingCollections } =
    useFetchCollections();

  return (
    <PopoverContent className="!tw-w-max !tw-p-0 tw-shadow-md">
      <Command
        key={selectedCollectionUuid}
        className="!tw-min-w-[150px] tw-bg-background tw-font-sans"
        defaultValue={selectedCollectionUuid || collections?.[0]?.uuid}
      >
        <CommandInput
          placeholder="Search..."
          className="!tw-h-max !tw-min-w-[80px] !tw-py-2 !tw-text-sm"
          searchIcon={false}
        />
        <CommandEmpty>No collection found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              keywords={[""]}
              className={cn(
                "tw-group tw-w-full tw-max-w-full tw-overflow-hidden tw-rounded-md tw-transition-colors tw-duration-100 tw-ease-in-out hover:!tw-text-accent-foreground",
                {
                  "!tw-text-accent-foreground": !selectedCollectionUuid,
                  "!tw-text-foreground": selectedCollectionUuid,
                },
              )}
              value=""
              onSelect={(currentValue) => {
                setSelectedCollectionUuid(currentValue);
              }}
            >
              <div className="tw-max-w-[250px] tw-truncate !tw-py-1 !tw-text-sm">
                Your AI Profile
              </div>
              <UserProfileActions
                toggleEditUserProfileDialog={toggleEditUserProfileDialog}
                setOpen={setOpen}
              />
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Collections">
            {isLoadingCollections && (
              <div className="tw-my-4 tw-flex tw-items-center tw-justify-center tw-gap-2">
                <LoaderCircle className="tw-size-4 tw-animate-spin" />
                <span>Loading...</span>
              </div>
            )}
            {collections && collections.length === 0 && (
              <div className="tw-my-4 tw-w-full tw-text-center tw-text-sm tw-text-muted-foreground">
                No collection found.
              </div>
            )}
            {collections &&
              collections.map((collection) => (
                <CollectionItem
                  key={collection.uuid}
                  collection={collection}
                  selectedCollectionUuid={selectedCollectionUuid}
                  setSelectedCollectionUuid={setSelectedCollectionUuid}
                  setEditCollection={setEditCollection}
                  setOpen={setOpen}
                />
              ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  );
}

function UserProfileActions({
  toggleEditUserProfileDialog,
  setOpen,
}: Pick<
  CollectionSelectorPopoverContentProps,
  "toggleEditUserProfileDialog" | "setOpen"
>) {
  const { data: userAiProfile, isLoading: isUserAiProfileLoading } =
    useFetchUserAiProfile();

  const { isUpdatingUserAiProfile, updateUserAiProfile } =
    useUpdateUserAiProfile();

  if (!userAiProfile || isUserAiProfileLoading) return null;

  return (
    <div className="tw-absolute tw-right-0 tw-flex tw-h-full tw-w-full tw-items-center tw-justify-end tw-gap-1 tw-px-2 group-hover:tw-bg-gradient-to-r group-hover:tw-from-transparent group-hover:tw-to-secondary">
      <Tooltip
        className="tw-max-h-[200px] tw-truncate"
        content={userAiProfile.bio}
        disabled={!userAiProfile.bio}
        positioning={{
          placement: "right",
          gutter: 60,
        }}
      >
        <div
          className="tw-hidden tw-rounded-md tw-border !tw-bg-background tw-p-2 tw-transition-all tw-duration-100 tw-ease-in-out active:tw-scale-95 group-hover:tw-block"
          onClick={(e) => {
            e.stopPropagation();
            toggleEditUserProfileDialog();
            setOpen(false);
          }}
        >
          <Pencil className="tw-size-3" />
        </div>
      </Tooltip>
      <Tooltip
        content={
          userAiProfile.disabled ? "Enable AI profile" : "Disable AI profile"
        }
      >
        <div
          className={cn(
            "tw-hidden tw-rounded-md tw-border !tw-bg-background tw-p-2 tw-transition-all tw-duration-100 tw-ease-in-out active:tw-scale-95 group-hover:tw-block",
            {
              "!tw-text-muted-foreground": isUpdatingUserAiProfile,
            },
          )}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();

            if (isUpdatingUserAiProfile) {
              return;
            }

            updateUserAiProfile({
              disabled: !userAiProfile.disabled,
            });
          }}
        >
          {userAiProfile.disabled ? (
            <Play className="tw-size-3" />
          ) : (
            <Pause className="tw-size-3" />
          )}
        </div>
      </Tooltip>
    </div>
  );
}

function CollectionItem({
  collection,
  selectedCollectionUuid,
  setSelectedCollectionUuid,
  setEditCollection,
  setOpen,
}: {
  collection: Collection;
  selectedCollectionUuid: string;
  setSelectedCollectionUuid: (uuid: string) => void;
  setEditCollection: (collection: Collection | undefined) => void;
  setOpen: (open: boolean) => void;
}) {
  return (
    <CommandItem
      keywords={[collection.title]}
      className={cn(
        "tw-group tw-overflow-hidden tw-rounded-md tw-transition-colors tw-duration-100 tw-ease-in-out hover:!tw-text-accent-foreground",
        {
          "!tw-text-accent-foreground":
            selectedCollectionUuid === collection.uuid,
          "!tw-text-foreground": selectedCollectionUuid !== collection.uuid,
        },
      )}
      value={collection.uuid}
      onSelect={(currentValue) => {
        setSelectedCollectionUuid(currentValue);
      }}
    >
      <div className="tw-max-w-[250px] tw-truncate !tw-py-1 !tw-text-sm">
        {collection.title}
      </div>
      <div className="tw-absolute tw-right-0 tw-flex tw-h-full tw-w-full tw-items-center tw-justify-end tw-gap-1 tw-px-2 group-hover:tw-bg-gradient-to-r group-hover:tw-from-transparent group-hover:tw-to-secondary">
        <Tooltip
          content={
            <div className="tw-line-clamp-5">
              {collection.description || collection.instructions}
            </div>
          }
          disabled={!collection.instructions && !collection.description}
          positioning={{
            placement: "right",
            gutter: 60,
          }}
        >
          <div
            className="tw-hidden tw-rounded-md tw-border !tw-bg-background tw-p-2 tw-transition-all tw-duration-100 tw-ease-in-out active:tw-scale-95 group-hover:tw-block"
            onClick={(e) => {
              e.stopPropagation();
              setEditCollection(collection);
              setOpen(false);
            }}
          >
            <Pencil className="tw-size-3" />
          </div>
        </Tooltip>
        <div
          className="tw-hidden tw-rounded-md tw-border !tw-bg-background tw-p-2 tw-transition-all tw-duration-100 tw-ease-in-out active:tw-scale-95 group-hover:tw-block"
          onClick={() => {
            webpageMessenger.sendMessage({
              event: "routeToPage",
              payload: `/collections/${collection.slug}`,
            });
          }}
        >
          <ExternalLink className="tw-size-3" />
        </div>
      </div>
    </CommandItem>
  );
}
