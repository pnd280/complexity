import {
  useEffect,
  useState,
} from 'react';

import pplxApi from '@/utils/pplx-api';
import { useQuery } from '@tanstack/react-query';

import useUpdateUserProfileSettings from './hooks/useUpdateUserProfileSettings';
import TextareaWithLimit from './TextareaWithLimit';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from './ui/dialog';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { useToast } from './ui/use-toast';

type UserProfileEditProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UserProfileEditDialog({
  open,
  onOpenChange,
}: UserProfileEditProps) {
  const { toast } = useToast();

  const { data: userProfileSettings } = useQuery({
    queryKey: ['userProfileSettings'],
    queryFn: pplxApi.fetchUserProfileSettings,
    enabled: false,
  });

  const { updateUserProfileSettings } = useUpdateUserProfileSettings();

  const [bio, setBio] = useState('');

  const handleSave = async ({ newBio }: { newBio: string }) => {
    try {
      await updateUserProfileSettings({
        bio: newBio,
      });
    } catch (error) {
      toast({
        title: '❌ Failed to update user profile',
        description: 'An error occurred while updating user profile',
        timeout: 2000,
      });
    }
  };

  useEffect(() => {
    setBio(userProfileSettings?.bio ?? '');
  }, [open, userProfileSettings?.bio]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="tw-max-w-full xl:tw-max-w-[50vw] tw-h-[50vh] tw-max-h-[900px] !tw-flex tw-flex-col tw-justify-start tw-flex-grow tw-font-sans">
        <DialogHeader>
          <DialogHeader className="tw-text-3xl">Edit User Profile</DialogHeader>
          <Separator />
        </DialogHeader>
        <div className="tw-flex tw-flex-col tw-items-center tw-gap-4 tw-flex-grow">
          <div className="w-full tw-flex tw-flex-col tw-gap-2 tw-flex-grow !tw-h-full">
            <Label htmlFor="prompt">Prompt</Label>
            <TextareaWithLimit
              placeholder="User profile AI Prompt"
              onResize={(e) => e.preventDefault()}
              className="tw-resize-none tw-h-full"
              limit={1000}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            disabled={bio.length > 1000}
            onClick={() => {
              handleSave({
                newBio: bio,
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
