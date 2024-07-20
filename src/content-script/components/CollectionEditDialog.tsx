import {
  useEffect,
  useState,
} from 'react';

import { globalStore } from '@/content-script/session-store/global';
import PPLXApi from '@/services/PPLXApi';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import InputWithLimit from '@/shared/components/InputWithLimit';
import { Collection } from './QueryBox/CollectionSelector';
import TextareaWithLimit from '@/shared/components/TextareaWithLimit';
import { Button } from '@/shared/components/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/shared/components/shadcn/ui/dialog';
import { Label } from '@/shared/components/shadcn/ui/label';
import { Separator } from '@/shared/components/shadcn/ui/separator';
import { useToast } from '@/shared/components/shadcn/ui/use-toast';

type CollectionEditDialogProps = {
  collection: Collection;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const limits = {
  title: 50,
  description: 1000,
  instructions: 2000,
};

export default function CollectionEditDialog({
  collection,
  open,
  onOpenChange,
}: CollectionEditDialogProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { refetch: refetchCollections } = useQuery({
    queryKey: ['collections'],
    queryFn: PPLXApi.fetchCollections,
    enabled: false,
  });

  const { mutateAsync } = useMutation({
    mutationKey: ['editCollection'],
    mutationFn: PPLXApi.updateCollection,
    onMutate: (args) => {
      const oldCollections = queryClient.getQueryData<Collection[]>([
        'collections',
      ]);

      queryClient.setQueryData(
        ['collections'],
        (oldCollections: Collection[]) => {
          return oldCollections.map((oldCollection) => {
            if (oldCollection.uuid === collection.uuid) {
              return {
                ...oldCollection,
                title: args.newTitle,
                description: args.newDescription,
                instructions: args.newInstructions,
              };
            }

            return oldCollection;
          });
        }
      );

      return oldCollections;
    },
    onError(error, __, context) {
      queryClient.setQueryData(['collections'], () => context);
    },
    onSettled: () => {
      setTimeout(() => {
        refetchCollections();
      }, 5000);
    },
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    if (!open) return;

    setTitle(collection.title);
    setDescription(collection.description);
    setInstructions(collection.instructions);
  }, [open, collection]);

  const handleSave = async ({
    title: newTitle,
    description: newDescription,
    instructions: newInstructions,
  }: Pick<Collection, 'title' | 'description' | 'instructions'>) => {
    try {
      await mutateAsync({
        collection,
        newTitle,
        newDescription,
        newInstructions,
      });
    } catch (error) {
      toast({
        title: '❌ Failed to update collection',
        description: 'An error occurred while updating the collection',
        timeout: 2000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => onOpenChange(open)}>
      <DialogContent className="tw-max-w-full xl:tw-max-w-[40vw] tw-h-[90vh] tw-max-h-[900px] !tw-flex tw-flex-col tw-justify-start tw-flex-grow tw-font-sans">
        <DialogHeader>
          <DialogHeader className="tw-text-3xl">Edit Collection</DialogHeader>
          <Separator />
        </DialogHeader>
        <div className="tw-flex tw-flex-col tw-items-center tw-gap-4 tw-flex-grow">
          <div className="tw-w-full tw-flex tw-flex-col tw-gap-2">
            <Label htmlFor="title">Title</Label>
            <InputWithLimit
              id="title"
              placeholder="Collection title"
              limit={limits.title}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="w-full tw-flex tw-flex-col tw-gap-2">
            <Label htmlFor="description">Description</Label>
            <TextareaWithLimit
              placeholder="Collection description"
              onResize={(e) => e.preventDefault()}
              className="tw-resize-none"
              limit={limits.description}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="w-full tw-flex tw-flex-col tw-gap-2 tw-flex-grow !tw-h-full">
            <Label htmlFor="prompt">System prompt</Label>
            <TextareaWithLimit
              placeholder="Collection prompt"
              onResize={(e) => e.preventDefault()}
              className="tw-resize-none tw-h-full"
              limit={limits.instructions}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            disabled={
              !title ||
              title.length > limits.title ||
              description.length > limits.description ||
              instructions.length >
                (globalStore.getState().secretMode
                  ? 10000
                  : limits.instructions)
            }
            onClick={() => {
              handleSave({
                title,
                description,
                instructions,
              });
              onOpenChange(false);
            }}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
