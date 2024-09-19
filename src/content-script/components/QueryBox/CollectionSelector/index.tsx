import { useToggle } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

import CollectionEditDialog from "@/content-script/components/QueryBox/CollectionSelector/CollectionEditDialog";
import { CollectionSelectorPopoverContent } from "@/content-script/components/QueryBox/CollectionSelector/PopoverContent";
import CollectionSelectorPopoverTrigger from "@/content-script/components/QueryBox/CollectionSelector/PopoverTrigger";
import UserProfileEditDialog from "@/content-script/components/QueryBox/CollectionSelector/UserProfileEditDialog";
import useFetchCollections from "@/content-script/hooks/useFetchCollections";
import useRouter from "@/content-script/hooks/useRouter";
import { useGlobalStore } from "@/content-script/session-store/global";
import { useQueryBoxStore } from "@/content-script/session-store/query-box";
import { Popover, PopoverContext } from "@/shared/components/Popover";
import { Collection } from "@/types/collection.types";
import UiUtils from "@/utils/UiUtils";
import { whereAmI } from "@/utils/utils";

export default function CollectionSelector() {
  const { url } = useRouter();

  const isLoggedIn = useGlobalStore((state) => state.isLoggedIn);

  const { data: collections } = useFetchCollections();

  const [editUserProfileDialog, toggleEditUserProfileDialog] = useToggle(false);
  const [editCollection, setEditCollection] = useState<
    Collection | undefined
  >();

  const { selectedCollectionUuid, setSelectedCollectionUuid } =
    useQueryBoxStore((state) => state);

  useEffect(() => {
    UiUtils.getActiveQueryBoxTextarea({}).trigger("focus");
  }, [selectedCollectionUuid]);

  useEffect(() => {
    const autoSelect = () => {
      if (whereAmI() !== "collection") return;

      const collectionSlug = window.location.pathname.split("/").pop();

      const collection = collections?.find((x) => x.slug === collectionSlug);

      if (collection == null) return;

      setSelectedCollectionUuid(collection.uuid);
    };

    autoSelect();
  }, [url, collections, setSelectedCollectionUuid]);

  if (!isLoggedIn) return null;

  return (
    <>
      <Popover portal={false}>
        <CollectionSelectorPopoverTrigger
          selectedCollectionUuid={selectedCollectionUuid}
          setSelectedCollectionUuid={setSelectedCollectionUuid}
        />
        <PopoverContext>
          {({ setOpen }) => (
            <CollectionSelectorPopoverContent
              selectedCollectionUuid={selectedCollectionUuid}
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
