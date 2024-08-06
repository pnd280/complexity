import { useQuery } from "@tanstack/react-query";
import { useToggle } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

import CollectionEditDialog from "@/content-script/components/CollectionEditDialog";
import { CollectionSelectorPopoverContent } from "@/content-script/components/QueryBox/CollectionSelector/PopoverContent";
import CollectionSelectorPopoverTrigger from "@/content-script/components/QueryBox/CollectionSelector/PopoverTrigger";
import UserProfileEditDialog from "@/content-script/components/UserProfileEditDialog";
import useRouter from "@/content-script/hooks/useRouter";
import useUpdateUserProfileSettings from "@/content-script/hooks/useUpdateUserProfileSettings";
import { useQueryBoxStore } from "@/content-script/session-store/query-box";
import { Popover, PopoverContext } from "@/shared/components/Popover";
import { UserProfileSettingsApiResponse } from "@/types/pplx-api.types";
import UiUtils from "@/utils/UiUtils";
import { whereAmI } from "@/utils/utils";

export type Collection = {
  title: string;
  uuid: string;
  instructions: string;
  url: string;
  description: string;
  access: 1 | 2;
};

export default function CollectionSelector() {
  const { url } = useRouter();

  const { data: collections, isLoading: isLoadingCollections } = useQuery<
    Collection[]
  >({
    queryKey: ["collections"],
    enabled: false,
  });

  const { data: userProfileSettings, isLoading: isUserProfileSettingsLoading } =
    useQuery<UserProfileSettingsApiResponse>({
      queryKey: ["userProfileSettings"],
      enabled: false,
    });

  const { isUpdatingUserProfileSettings, updateUserProfileSettings } =
    useUpdateUserProfileSettings();

  const [editUserProfileDialog, toggleEditUserProfileDialog] = useToggle(false);
  const [editCollection, setEditCollection] = useState<
    Collection | undefined
  >();

  const selectedCollectionUuid = useQueryBoxStore(
    (state) => state.selectedCollectionUuid,
  );
  const setSelectedCollectionUuid = useQueryBoxStore(
    (state) => state.setSelectedCollectionUuid,
  );

  useEffect(() => {
    UiUtils.getActiveQueryBoxTextarea({}).trigger("focus");
  }, [selectedCollectionUuid]);

  useEffect(() => {
    const autoSelect = () => {
      if (whereAmI() !== "collection") return;

      const collectionSlug = window.location.pathname.split("/").pop();
      const collection = collections?.find((x) => x.url === collectionSlug);

      if (!collection) return;

      setSelectedCollectionUuid(collection.uuid);
    };

    autoSelect();
  }, [url, collections, setSelectedCollectionUuid]);

  return (
    <>
      <Popover portal={false}>
        <CollectionSelectorPopoverTrigger
          selectedCollectionUuid={selectedCollectionUuid}
          collections={collections}
          setSelectedCollectionUuid={setSelectedCollectionUuid}
        />
        <PopoverContext>
          {({ setOpen }) => (
            <CollectionSelectorPopoverContent
              selectedCollectionUuid={selectedCollectionUuid}
              collections={collections}
              isLoadingCollections={isLoadingCollections}
              userProfileSettings={userProfileSettings}
              isUserProfileSettingsLoading={isUserProfileSettingsLoading}
              isUpdatingUserProfileSettings={isUpdatingUserProfileSettings}
              updateUserProfileSettings={updateUserProfileSettings}
              setSelectedCollectionUuid={setSelectedCollectionUuid}
              toggleEditUserProfileDialog={toggleEditUserProfileDialog}
              setEditCollection={setEditCollection}
              setOpen={setOpen}
            />
          )}
        </PopoverContext>
      </Popover>
      <CollectionEditDialog
        collection={editCollection}
        setEditCollection={setEditCollection}
      />
      <UserProfileEditDialog
        open={editUserProfileDialog}
        onOpenChange={toggleEditUserProfileDialog}
      />
    </>
  );
}
