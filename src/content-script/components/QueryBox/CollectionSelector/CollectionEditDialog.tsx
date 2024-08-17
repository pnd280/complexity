import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import useFetchCollections from "@/content-script/hooks/useFetchCollections";
import PplxApi from "@/services/PplxApi";
import Button from "@/shared/components/Button";
import CopyButton from "@/shared/components/CopyButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/shared/components/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/Form";
import InputWithLimit from "@/shared/components/InputWithLimit";
import Separator from "@/shared/components/Separator";
import TextareaWithLimit from "@/shared/components/TextareaWithLimit";
import useTabNavigation from "@/shared/hooks/useTabNavigation";
import { useToast } from "@/shared/toast";
import { Collection } from "@/types/collection.types";
import { queryClient } from "@/utils/ts-query-query-client";

const limits = {
  title: 50,
  description: 1000,
  instructions: 2000,
};

const schema = z.object({
  title: z.string().min(1).max(limits.title),
  description: z.string().max(limits.description),
  instructions: z.string().max(limits.instructions),
});

type FormData = z.infer<typeof schema>;

type CollectionEditDialogProps = {
  collection?: Collection;
  setEditCollection: Dispatch<SetStateAction<Collection | undefined>>;
};

const DialogContentWrapper = ({
  collection,
  toggleDialogVis,
}: {
  collection: Collection;
  toggleDialogVis: Dispatch<SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();
  const fieldNames = ["title", "description", "instructions"];
  const { formRef, handleTabNavigation } = useTabNavigation(fieldNames);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: collection.title,
      description: collection.description,
      instructions: collection.instructions,
    },
  });

  const {
    handleSubmit,
    formState: { isDirty, isValid },
  } = form;

  const { refetch: refetchCollections } = useFetchCollections();

  const { mutateAsync } = useMutation({
    mutationKey: ["editCollection"],
    mutationFn: PplxApi.updateCollection,
    onMutate: (args) => {
      const oldCollections = queryClient.getQueryData<Collection[]>([
        "collections",
      ]);

      queryClient.setQueryData(
        ["collections"],
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
        },
      );

      return oldCollections;
    },
    onError(_, __, context) {
      queryClient.setQueryData(["collections"], () => context);
    },
    onSettled: () => {
      setTimeout(() => {
        refetchCollections();
      }, 5000);
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync({
        collection,
        newTitle: data.title,
        newDescription: data.description,
        newInstructions: data.instructions,
      });
    } catch (error) {
      toast({
        title: "❌ Failed to update collection",
        description: "An error occurred while updating the collection",
        timeout: 2000,
      });
    } finally {
      toggleDialogVis(false);
    }
  };

  return (
    <DialogContent className="!tw-flex tw-w-full tw-flex-col tw-justify-start tw-font-sans xl:tw-w-[40vw]">
      <DialogHeader className="tw-text-3xl">Edit Collection</DialogHeader>
      <div className="tw-flex tw-items-center tw-gap-2">
        uuid:
        <DialogDescription>{collection.uuid}</DialogDescription>
        <CopyButton content={collection.uuid} />
      </div>
      <Separator />
      <Form {...form}>
        <form
          ref={formRef}
          className="tw-flex tw-flex-col tw-items-center tw-gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="tw-w-full">
                <FormLabel htmlFor="title">Title</FormLabel>
                <FormControl>
                  <InputWithLimit
                    id="title"
                    placeholder="Collection title"
                    limit={limits.title}
                    onKeyDown={handleTabNavigation}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="tw-w-full">
                <FormLabel htmlFor="description">Description</FormLabel>
                <FormControl>
                  <TextareaWithLimit
                    id="description"
                    placeholder="Collection description"
                    className="tw-resize-none"
                    limit={limits.description}
                    onResize={(e) => e.preventDefault()}
                    onKeyDown={handleTabNavigation}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem className="tw-w-full">
                <FormLabel htmlFor="instructions">System prompt</FormLabel>
                <FormControl>
                  <TextareaWithLimit
                    id="instructions"
                    placeholder="Collection prompt"
                    className="tw-h-[300px] tw-resize-none"
                    limit={limits.instructions}
                    onResize={(e) => e.preventDefault()}
                    onKeyDown={handleTabNavigation}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="tw-w-full">
            <Button
              type="submit"
              disabled={!isDirty || !isValid}
              className="tw-ml-auto"
            >
              Update
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default function CollectionEditDialog({
  collection,
  setEditCollection,
}: CollectionEditDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (collection) {
      setIsOpen(true);
    }
  }, [collection]);

  return (
    <Dialog
      open={isOpen}
      closeOnInteractOutside={false}
      onOpenChange={({ open }) => {
        setIsOpen(open);
      }}
      onExitComplete={() => {
        if (!isOpen) {
          setEditCollection(undefined);
        }
      }}
    >
      {collection && (
        <DialogContentWrapper
          collection={collection}
          toggleDialogVis={setIsOpen}
        />
      )}
    </Dialog>
  );
}
