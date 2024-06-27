import {
  useEffect,
  useState,
} from 'react';

import clsx from 'clsx';
import {
  ExternalLink,
  LayoutGrid,
  LoaderCircle,
  Pause,
  Pencil,
  Play,
  X,
} from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useQueryBoxStore } from '@/content-script/session-store/query-box';
import { webpageMessenger } from '@/content-script/webpage/messenger';
import { cn } from '@/lib/utils';
import { UserProfileSettingsAPIResponse } from '@/types/PPLXApi';
import observer from '@/utils/observer';
import { ui } from '@/utils/ui';
import { whereAmI } from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';
import { useToggle } from '@uidotdev/usehooks';

import CollectionEditDialog from '../CollectionEditDialog';
import useUpdateUserProfileSettings
  from '../hooks/useUpdateUserProfileSettings';
import TooltipWrapper from '../TooltipWrapper';
import UserProfileEditDialog from '../UserProfileEditDialog';

export type Collection = {
  title: string;
  uuid: string;
  instructions: string;
  url: string;
  description: string;
  access: 1 | 2;
};

export default function CollectionSelector() {
  const { data: collections, isLoading: isLoadingCollections } = useQuery<
    Collection[]
  >({
    queryKey: ['collections'],
  });

  const { data: userProfileSettings, isLoading: isUserProfileSettingsLoading } =
    useQuery<UserProfileSettingsAPIResponse>({
      queryKey: ['userProfileSettings'],
      enabled: false,
    });

  const { isUpdatingUserProfileSettings, updateUserProfileSettings } =
    useUpdateUserProfileSettings();

  const [open, toggleOpen] = useToggle(false);
  const [editUserProfileDialog, toggleEditUserProfileDialog] = useToggle(false);
  const [editDialogOpen, toggleEditDialogOpen] = useToggle(false);
  const [editCollection, setEditCollection] = useState<Collection>();

  const selectedCollectionUuid = useQueryBoxStore(
    (state) => state.selectedCollectionUuid
  );
  const setSelectedCollectionUuid = useQueryBoxStore(
    (state) => state.setSelectedCollectionUuid
  );

  useEffect(() => {
    ui.findActiveQueryBoxTextarea({}).trigger('focus');
  }, [selectedCollectionUuid]);

  useEffect(() => {
    const autoSelect = () => {
      if (whereAmI() !== 'collection') return;

      const collectionSlug = window.location.pathname.split('/').pop();

      const collection = collections?.find((x) => x.url === collectionSlug);

      if (!collection) return;

      setSelectedCollectionUuid(collection.uuid);
    };

    autoSelect();

    const stopObserving = observer.onShallowRouteChange(autoSelect);

    return () => stopObserving();
  }, [collections, setSelectedCollectionUuid]);

  return (
    <>
      <Popover open={open} onOpenChange={toggleOpen}>
        <TooltipWrapper
          content={!selectedCollectionUuid ? 'Chat with a collection' : ''}
        >
          <PopoverTrigger asChild>
            <div className="tw-relative tw-flex tw-items-center tw-rounded-md tw-px-2 tw-text-sm [&>span]:tw-select-none [&>span]:!tw-truncate tw-transition-all tw-duration-300 tw-text-muted-foreground hover:tw-text-accent-foreground hover:tw-bg-accent text-center tw-max-w-[150px] tw-gap-2 cursor-pointer active:tw-scale-95 tw-animate-in tw-zoom-in tw-group tw-h-full">
              {selectedCollectionUuid && (
                <X
                  className="tw-w-4 tw-h-4 !tw-hidden group-hover:!tw-block"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCollectionUuid('');
                  }}
                />
              )}
              <LayoutGrid
                className={clsx('tw-w-4 tw-h-4', {
                  'group-hover:!tw-hidden': selectedCollectionUuid,
                })}
              />
              {collections && selectedCollectionUuid ? (
                <span className="tw-items-center tw-max-w-[110px]">
                  {
                    collections.find(
                      (collection) => collection.uuid === selectedCollectionUuid
                    )?.title
                  }
                </span>
              ) : null}
            </div>
          </PopoverTrigger>
        </TooltipWrapper>
        <PopoverContent className="!tw-w-max !tw-p-0">
          <Command
            key={selectedCollectionUuid}
            className="!tw-min-w-[150px] tw-bg-background tw-font-sans"
            defaultValue={
              selectedCollectionUuid
                ? selectedCollectionUuid
                : collections?.[0]?.uuid
            }
          >
            <CommandInput
              placeholder="Search..."
              className="!tw-py-2 !tw-h-max !tw-min-w-[80px] !tw-text-sm"
              searchIcon={false}
            />
            <CommandEmpty>No collection found.</CommandEmpty>

            <CommandList>
              <CommandGroup>
                <Selection
                  keywords={['', 'Default', 'Your AI Profile']}
                  className={clsx(
                    'tw-w-full tw-max-w-full hover:!tw-text-accent-foreground tw-transition-colors tw-duration-100 tw-ease-in-out tw-group tw-rounded-md tw-overflow-hidden',
                    {
                      '!tw-text-accent-foreground': !selectedCollectionUuid,
                      '!tw-text-foreground': selectedCollectionUuid,
                    }
                  )}
                  value=""
                  onSelect={(currentValue) => {
                    toggleOpen(false);
                    setSelectedCollectionUuid(currentValue);
                  }}
                  title="Your AI Profile"
                >
                  <div className="tw-absolute tw-right-0 tw-w-full tw-h-full tw-flex tw-gap-1 tw-justify-end tw-items-center tw-px-2 group-hover:tw-bg-gradient-to-r group-hover:tw-from-transparent group-hover:tw-to-secondary">
                    <TooltipWrapper
                      content={userProfileSettings?.bio || ''}
                      contentOptions={{
                        side: 'right',
                        sideOffset: 60,
                      }}
                    >
                      <div
                        className="tw-hidden group-hover:tw-block tw-p-2 !tw-bg-background tw-rounded-md tw-transition-all tw-duration-100 tw-ease-in-out tw-border active:tw-scale-95"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleOpen(false);
                          toggleEditUserProfileDialog();
                        }}
                      >
                        <Pencil className="tw-w-3 tw-h-3" />
                      </div>
                    </TooltipWrapper>

                    <TooltipWrapper
                      content={
                        userProfileSettings?.disabled
                          ? 'Enable AI profile'
                          : 'Disable AI profile'
                      }
                    >
                      <div
                        className={cn(
                          'tw-hidden group-hover:tw-block tw-p-2 !tw-bg-background tw-rounded-md tw-transition-all tw-duration-100 tw-ease-in-out tw-border active:tw-scale-95',
                          {
                            '!tw-text-muted-foreground':
                              isUpdatingUserProfileSettings,
                          }
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();

                          if (isUpdatingUserProfileSettings) {
                            return;
                          }

                          updateUserProfileSettings({
                            disabled: !userProfileSettings?.disabled,
                          });
                        }}
                      >
                        {isUserProfileSettingsLoading ||
                        isUpdatingUserProfileSettings ? (
                          <LoaderCircle className="tw-w-3 tw-h-3 tw-animate-spin" />
                        ) : (
                          <>
                            {userProfileSettings?.disabled ? (
                              <Play className="tw-w-3 tw-h-3" />
                            ) : (
                              <Pause className="tw-w-3 tw-h-3" />
                            )}
                          </>
                        )}
                      </div>
                    </TooltipWrapper>
                  </div>
                </Selection>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Collections">
                {isLoadingCollections && (
                  <div className="tw-flex tw-gap-2 tw-justify-center tw-items-center tw-my-4">
                    <LoaderCircle className="tw-w-4 tw-h-4 tw-animate-spin" />
                    <span>Loading...</span>
                  </div>
                )}
                {collections && collections.length === 0 && (
                  <div className="tw-text-sm tw-text-center tw-text-muted-foreground tw-my-4 tw-w-full">
                    No collection found.
                  </div>
                )}
                {collections &&
                  collections.map((collection) => (
                    <Selection
                      key={collection.uuid}
                      keywords={[collection.title]}
                      className={clsx(
                        'hover:!tw-text-accent-foreground tw-transition-colors tw-duration-100 tw-ease-in-out tw-group tw-rounded-md tw-overflow-hidden',
                        {
                          '!tw-text-accent-foreground':
                            selectedCollectionUuid === collection.uuid,
                          '!tw-text-foreground':
                            selectedCollectionUuid !== collection.uuid,
                        }
                      )}
                      value={collection.uuid}
                      onSelect={(currentValue) => {
                        toggleOpen(false);
                        setSelectedCollectionUuid(currentValue);
                      }}
                      title={collection.title}
                    >
                      <div className="tw-absolute tw-right-0 tw-w-full tw-h-full tw-flex tw-gap-1 tw-justify-end tw-items-center tw-px-2 group-hover:tw-bg-gradient-to-r group-hover:tw-from-transparent group-hover:tw-to-secondary">
                        <TooltipWrapper
                          content={
                            collection.instructions || collection.description
                          }
                          contentOptions={{
                            side: 'right',
                            sideOffset: 60,
                          }}
                        >
                          <div
                            className="tw-hidden group-hover:tw-block tw-p-2 !tw-bg-background tw-rounded-md tw-transition-all tw-duration-100 tw-ease-in-out tw-border active:tw-scale-95"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleOpen(false);
                              setEditCollection(collection);
                              toggleEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="tw-w-3 tw-h-3" />
                          </div>
                        </TooltipWrapper>

                        <div
                          className="tw-hidden group-hover:tw-block tw-p-2 !tw-bg-background tw-rounded-md tw-transition-all tw-duration-100 tw-ease-in-out tw-border active:tw-scale-95"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleOpen(false);
                            webpageMessenger.sendMessage({
                              event: 'routeToPage',
                              payload: `/collections/${collection.url}`,
                            });
                          }}
                        >
                          <ExternalLink className="tw-w-3 tw-h-3" />
                        </div>
                      </div>
                    </Selection>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {editCollection && (
        <CollectionEditDialog
          collection={editCollection}
          open={editDialogOpen}
          onOpenChange={toggleEditDialogOpen}
        />
      )}
      <UserProfileEditDialog
        open={editUserProfileDialog}
        onOpenChange={toggleEditUserProfileDialog}
      />
    </>
  );
}

type SelectionProps = {
  keywords: string[];
  className?: string;
  value: string;
  onSelect: (value: string) => void;
  title: string;
  children?: React.ReactNode;
};

function Selection({
  keywords,
  className,
  value,
  onSelect,
  title,
  children,
}: SelectionProps) {
  return (
    <CommandItem
      keywords={keywords}
      className={className}
      value={value}
      onSelect={(currentValue) => {
        onSelect(currentValue);
      }}
    >
      <div className="!tw-text-sm !tw-py-1 tw-truncate">{title}</div>
      {children}
    </CommandItem>
  );
}
