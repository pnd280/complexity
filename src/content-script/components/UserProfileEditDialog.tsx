import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import useFetchUserAiProfile from "@/content-script/hooks/useFetchUserAiProfile";
import useUpdateUserAiProfile from "@/content-script/hooks/useUpdateUserAiProfile";
import Button from "@/shared/components/Button";
import {
  Dialog,
  DialogContent,
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
import Separator from "@/shared/components/Separator";
import TextareaWithLimit from "@/shared/components/TextareaWithLimit";
import { useToast } from "@/shared/toast";

const schema = z.object({
  bio: z.string().max(1500, "Bio must not exceed 1500 characters"),
});

type FormData = z.infer<typeof schema>;

type UserProfileEditProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UserProfileEditDialog({
  open,
  onOpenChange,
}: UserProfileEditProps) {
  const { toast } = useToast();

  const { data: userAiProfile } = useFetchUserAiProfile();
  const { updateUserAiProfile } = useUpdateUserAiProfile();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bio: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = form;

  const onSubmit = async (data: FormData) => {
    try {
      onOpenChange(false);
      await updateUserAiProfile({
        bio: data.bio,
      });
    } catch (error) {
      toast({
        title: "❌ Failed to update user profile",
        description: "An error occurred while updating user profile",
        timeout: 2000,
      });
    }
  };

  useEffect(() => {
    if (userAiProfile) {
      reset({
        bio: userAiProfile.bio || "",
      });
    }
  }, [open, userAiProfile, reset]);

  return (
    <Dialog
      closeOnInteractOutside={false}
      open={open}
      onOpenChange={({ open }) => onOpenChange(open)}
    >
      <DialogContent className="!tw-flex tw-h-[50vh] tw-max-h-[900px] tw-max-w-full tw-flex-grow tw-flex-col tw-justify-start tw-font-sans xl:tw-max-w-[50vw]">
        <DialogHeader>
          <DialogHeader className="tw-text-3xl">Edit User Profile</DialogHeader>
          <Separator />
        </DialogHeader>
        <Form {...form}>
          <form
            className="tw-flex tw-flex-grow tw-flex-col tw-items-center tw-gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="w-full tw-flex !tw-h-full tw-flex-grow tw-flex-col tw-gap-2">
                  <FormLabel htmlFor="bio">Prompt</FormLabel>
                  <FormControl>
                    <TextareaWithLimit
                      placeholder="User profile AI Prompt"
                      className="tw-h-full tw-resize-none"
                      limit={1500}
                      onResize={(e) => e.preventDefault()}
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
                className="tw-ml-auto"
                disabled={!isValid || !isDirty}
              >
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
