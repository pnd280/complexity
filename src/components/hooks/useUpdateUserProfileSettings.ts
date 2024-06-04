import { UserProfileSettingsAPIResponse } from '@/types/PPLXApi';
import pplxApi from '@/utils/pplx-api';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

export default function useUpdateUserProfileSettings() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['updateUserProfileSettings'],
    mutationFn: pplxApi.updateUserProfileSettings,
    onMutate: (args) => {
      const oldSettings =
        queryClient.getQueryData<UserProfileSettingsAPIResponse>([
          'userProfileSettings',
        ]);

      queryClient.setQueryData(
        ['userProfileSettings'],
        (oldSettings: UserProfileSettingsAPIResponse) => {
          return {
            ...oldSettings,
            ...args,
          };
        }
      );

      return oldSettings;
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['userProfileSettings'], context ?? variables);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['userProfileSettings'],
      });
    },
  });

  return {
    updateUserProfileSettings: mutateAsync,
    isUpdatingUserProfileSettings: isPending,
  }
}
