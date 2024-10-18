import { FaEye, FaFile } from "react-icons/fa";
import {
  LuLoader2 as LoaderCircle,
  LuPause as Pause,
  LuPlay as Play,
  LuLoader2,
  LuExternalLink,
  LuRefreshCcw,
} from "react-icons/lu";

import useFetchSpaceFiles from "@/content-script/hooks/useFetchSpaceFiles";
import useFetchSpaces from "@/content-script/hooks/useFetchSpaces";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/shared/components/HoverCard";
import { PopoverContent } from "@/shared/components/Popover";
import Tooltip from "@/shared/components/Tooltip";
import { Space } from "@/types/space.types";
import { cn } from "@/utils/cn";
import { queryClient } from "@/utils/ts-query-query-client";
import { whereAmI } from "@/utils/utils";

type SpaceSelectorPopoverContentProps = {
  selectedSpaceUuid: string;
  setSelectedSpaceUuid: (uuid: string) => void;
};

export function SpaceSelectorPopoverContent({
  selectedSpaceUuid,
  setSelectedSpaceUuid,
}: SpaceSelectorPopoverContentProps) {
  const {
    data: spaces,
    isLoading: isLoadingSpaces,
    isPending: isPendingSpaces,
  } = useFetchSpaces();

  return (
    <PopoverContent className="!tw-w-max !tw-p-0 tw-shadow-md">
      <Command
        key={selectedSpaceUuid}
        className="!tw-min-w-[150px] tw-bg-background tw-font-sans"
        defaultValue={selectedSpaceUuid || spaces?.[0]?.uuid}
      >
        <CommandInput
          placeholder="Search..."
          className="!tw-h-max !tw-min-w-[80px] !tw-py-2 !tw-text-sm"
          searchIcon={false}
        />
        <CommandEmpty>No space found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              keywords={[""]}
              className={cn(
                "tw-group tw-w-full tw-max-w-full tw-overflow-hidden tw-rounded-md tw-transition-colors tw-duration-100 tw-ease-in-out hover:!tw-text-accent-foreground",
                {
                  "!tw-text-accent-foreground": !selectedSpaceUuid,
                  "!tw-text-foreground": selectedSpaceUuid,
                },
              )}
              value=""
              onSelect={(currentValue) => {
                if (whereAmI() === "space") {
                  webpageMessenger.sendMessage({
                    event: "routeToPage",
                    payload: `/`,
                  });
                }

                setSelectedSpaceUuid(currentValue);
              }}
            >
              <div className="tw-max-w-[250px] tw-truncate !tw-py-1 !tw-text-sm">
                AI Profile
              </div>
              <UserProfileActions />
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Spaces">
            {(isLoadingSpaces || isPendingSpaces) && (
              <div className="tw-my-4 tw-flex tw-items-center tw-justify-center tw-gap-2">
                <LoaderCircle className="tw-size-4 tw-animate-spin" />
                <span>Loading...</span>
              </div>
            )}
            {spaces && spaces.length === 0 && (
              <div className="tw-my-4 tw-w-full tw-text-center tw-text-sm tw-text-muted-foreground">
                No space found.
              </div>
            )}
            {spaces &&
              spaces.map((space) => (
                <SpaceItem
                  key={space.uuid}
                  space={space}
                  selectedSpaceUuid={selectedSpaceUuid}
                  setSelectedSpaceUuid={setSelectedSpaceUuid}
                />
              ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  );
}

function UserProfileActions() {
  const { data: userAiProfile, isLoading: isUserAiProfileLoading } =
    useFetchUserAiProfile();

  const { isUpdatingUserAiProfile, updateUserAiProfile } =
    useUpdateUserAiProfile();

  if (!userAiProfile || isUserAiProfileLoading)
    return (
      <div className="tw-ml-auto tw-text-foreground">
        <LuLoader2 className="tw-size-4 tw-animate-spin" />
      </div>
    );

  if (userAiProfile != null && !userAiProfile.has_profile) return;

  return (
    <div className="tw-absolute tw-right-0 tw-flex tw-h-full tw-w-full tw-items-center tw-justify-end tw-gap-1 tw-px-2 group-hover:tw-bg-gradient-to-r group-hover:tw-from-transparent group-hover:tw-to-secondary">
      <Tooltip
        className="tw-max-h-[200px] tw-truncate"
        content={userAiProfile.bio || "Your AI Profile is empty!"}
        positioning={{
          placement: "right",
          gutter: 60,
        }}
      >
        <div
          className="tw-hidden tw-rounded-md tw-border !tw-bg-background tw-p-2 tw-transition-all tw-duration-100 tw-ease-in-out active:tw-scale-95 group-hover:tw-block"
          onClick={() => {
            webpageMessenger.sendMessage({
              event: "routeToPage",
              payload: "/settings/profile",
            });
          }}
        >
          <FaEye className="tw-size-3" />
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

function SpaceItem({
  space,
  selectedSpaceUuid,
  setSelectedSpaceUuid,
}: {
  space: Space;
  selectedSpaceUuid: string;
  setSelectedSpaceUuid: (uuid: string) => void;
}) {
  return (
    <CommandItem
      keywords={[space.title]}
      className={cn(
        "tw-group tw-overflow-hidden tw-rounded-md tw-transition-colors tw-duration-100 tw-ease-in-out hover:!tw-text-accent-foreground",
        {
          "!tw-text-accent-foreground": selectedSpaceUuid === space.uuid,
          "!tw-text-foreground": selectedSpaceUuid !== space.uuid,
        },
      )}
      value={space.uuid}
      onSelect={(currentValue) => {
        setSelectedSpaceUuid(currentValue);

        if (whereAmI() === "space") {
          webpageMessenger.sendMessage({
            event: "routeToPage",
            payload: `/collections/${space.uuid}`,
          });
        }
      }}
    >
      <div className="tw-max-w-[250px] tw-truncate !tw-py-1 !tw-text-sm">
        {space.title}
      </div>
      <div className="tw-absolute tw-right-0 tw-flex tw-h-full tw-w-full tw-items-center tw-justify-end tw-gap-1 tw-px-2 group-hover:tw-bg-gradient-to-r group-hover:tw-from-transparent group-hover:tw-to-secondary">
        <HoverCard
          lazyMount
          openDelay={0}
          closeDelay={100}
          positioning={{
            placement: "right",
            gutter: 20,
          }}
        >
          <HoverCardTrigger>
            <div
              className="tw-hidden tw-rounded-md tw-border !tw-bg-background tw-p-2 tw-transition-all tw-duration-100 tw-ease-in-out active:tw-scale-95 group-hover:tw-block"
              onClick={(e) => {
                e.stopPropagation();
                webpageMessenger.sendMessage({
                  event: "routeToPage",
                  payload: `/collections/${space.uuid}`,
                });
              }}
            >
              <FaEye className="tw-size-3" />
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="max-w-[500px] tw-flex tw-flex-col tw-gap-2 tw-text-left tw-font-sans">
            <div className="tw-absolute tw-right-2 tw-top-2 tw-flex tw-gap-2">
              <div
                className="tw-cursor-pointer tw-text-muted-foreground tw-transition-colors tw-duration-100 tw-ease-in-out hover:tw-text-foreground"
                onClick={(e) => {
                  e.stopPropagation();

                  queryClient.invalidateQueries({
                    queryKey: ["space-files", space.uuid],
                  });
                }}
              >
                <LuRefreshCcw className="tw-size-3" />
              </div>
              <div
                className="tw-cursor-pointer tw-text-muted-foreground tw-transition-colors tw-duration-100 tw-ease-in-out hover:tw-text-foreground"
                onClick={() => {
                  webpageMessenger.sendMessage({
                    event: "routeToPage",
                    payload: `/collections/${space.uuid}`,
                  });
                }}
              >
                <LuExternalLink className="tw-size-3" />
              </div>
            </div>
            {space.description && (
              <div className="tw-flex tw-flex-col tw-gap-1">
                <div className="tw-text-xs tw-text-muted-foreground">
                  Description
                </div>
                <div className="tw-line-clamp-5 tw-text-sm">
                  {space.description}
                </div>
              </div>
            )}
            <div className="tw-flex tw-flex-col tw-gap-1">
              <div className="tw-text-xs tw-text-muted-foreground">
                Instruction
              </div>
              <div className="tw-line-clamp-5 tw-text-sm">
                {space.instructions || (
                  <div className="tw-text-xs tw-italic tw-text-muted-foreground">
                    This Space has no instruction!
                  </div>
                )}
              </div>
            </div>
            <div className="tw-flex tw-flex-col tw-gap-1">
              <div className="tw-text-xs tw-text-muted-foreground">Files</div>
              <div className="custom-scrollbar tw-max-h-[200px] tw-overflow-y-auto">
                <SpaceFiles spaceUuid={space.uuid} />
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </CommandItem>
  );
}

function SpaceFiles({ spaceUuid }: { spaceUuid: Space["uuid"] }) {
  const {
    files,
    query: { isFetching, isError, error },
  } = useFetchSpaceFiles({ spaceUuid });

  if (isFetching) {
    return (
      <div className="tw-my-2 tw-flex tw-flex-col tw-gap-2">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="tw-flex tw-items-center tw-gap-1">
            <div className="tw-size-4 tw-animate-pulse tw-rounded-full tw-bg-gray-100 tw-opacity-10"></div>
            <div className="tw-h-4 tw-w-32 tw-animate-pulse tw-rounded-md tw-bg-gray-100 tw-opacity-10"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) return <div>{error.message}</div>;

  if (files == null || files.length === 0)
    return (
      <div className="tw-text-xs tw-text-muted-foreground">
        No files found in this space!
      </div>
    );

  return (
    <div className="tw-flex tw-flex-col tw-gap-2">
      {files.map((file) => (
        <div
          key={file.file_uuid}
          className="tw-flex tw-items-center tw-gap-2 tw-text-xs"
        >
          <FaFile className="tw-size-3" />
          <div>{file.filename}</div>
        </div>
      ))}
    </div>
  );
}
