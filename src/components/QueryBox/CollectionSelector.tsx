import {
  useEffect,
  useState,
} from 'react';

import clsx from 'clsx';
import {
  ExternalLink,
  Eye,
  LayoutGrid,
  LoaderCircle,
  Pencil,
  X,
} from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useQueryBoxStore } from '@/content-script/session-store/query-box';
import { webpageMessenger } from '@/content-script/webpage/messenger';
import { ui } from '@/utils/ui';
import { useQuery } from '@tanstack/react-query';
import { useToggle } from '@uidotdev/usehooks';

import CollectionEditDialog from '../CollectionEditDialog';
import TooltipWrapper from '../TooltipWrapper';

export type Collection = {
  title: string;
  uuid: string;
  instructions: string;
  url: string;
  description: string;
  access: 1 | 2;
};

export default function CollectionSelector() {
  const { data: collections, isFetching: isFetchingCollections } = useQuery<
    Collection[]
  >({
    queryKey: ['collections'],
    initialData: [],
  });

  const [open, toggleOpen] = useToggle(false);
  const [editDialogOpen, toggleEditDialogOpen] = useToggle(false);
  const [editCollection, setEditCollection] = useState<Collection>();

  const selectedCollectionUuid = useQueryBoxStore(
    (state) => state.selectedCollectionUuid
  );
  const setSelectedCollectionUuid = useQueryBoxStore(
    (state) => state.setSelectedCollectionUuid
  );

  useEffect(() => {
    ui.findActiveQueryBoxTextarea().trigger('focus');
  }, [selectedCollectionUuid]);

  return (
    <>
      <Popover open={open} onOpenChange={toggleOpen}>
        <TooltipWrapper
          content={!selectedCollectionUuid ? 'Chat with a collection' : ''}
        >
          <PopoverTrigger asChild>
            <div className="tw-relative tw-flex tw-items-center tw-rounded-md tw-px-2 tw-text-sm [&>span]:tw-select-none [&>span]:!tw-truncate tw-transition-all tw-duration-300 tw-text-muted-foreground hover:tw-text-accent-foreground hover:tw-bg-accent text-center tw-max-w-[150px] tw-gap-2 cursor-pointer active:tw-scale-95 tw-animate-in tw-zoom-in tw-group">
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
              {selectedCollectionUuid ? (
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
          <Command className="!tw-min-w-[150px] tw-max-w-[250px] tw-bg-background">
            <CommandInput
              placeholder="Search..."
              className="!tw-py-2 !tw-h-max !tw-min-w-[80px] !tw-text-sm"
              searchIcon={false}
            />
            <CommandEmpty>
              {isFetchingCollections && collections.length < 1 ? (
                <div className="tw-flex tw-gap-2 tw-justify-center tw-items-center">
                  <LoaderCircle className="tw-w-4 tw-h-4 tw-animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                'No collection found.'
              )}
            </CommandEmpty>
            <CommandList>
              <CommandGroup>
                {collections.map((collection) => (
                  <CommandItem
                    key={collection.uuid}
                    keywords={[collection.title]}
                    className={clsx(
                      'tw-w-full tw-max-w-full hover:!tw-text-accent-foreground tw-transition-colors tw-duration-100 tw-ease-in-out tw-group tw-rounded-md tw-overflow-hidden',
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
                  >
                    <div className="!tw-text-sm !tw-py-1 tw-truncate tw-mr-8">
                      {collection.title}
                    </div>

                    <div className="tw-absolute tw-right-0 tw-w-full tw-h-full tw-flex tw-gap-1 tw-justify-end tw-items-center tw-px-2 group-hover:tw-bg-gradient-to-r group-hover:tw-from-transparent group-hover:tw-to-secondary">
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
                      {(collection.instructions || collection.instructions) && (
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
                            className="tw-hidden group-hover:tw-block tw-p-2 !tw-bg-background tw-rounded-md tw-transition-all tw-duration-100 tw-ease-in-out tw-cursor-default tw-border active:tw-scale-95"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Eye className="tw-w-3 tw-h-3" />
                          </div>
                        </TooltipWrapper>
                      )}
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
                  </CommandItem>
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
    </>
  );
}
