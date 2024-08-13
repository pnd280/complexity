import { useToggle } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

import CollectionEditDialog from "@/content-script/components/CollectionEditDialog";
import { CollectionSelectorPopoverContent } from "@/content-script/components/QueryBox/CollectionSelector/PopoverContent";
import CollectionSelectorPopoverTrigger from "@/content-script/components/QueryBox/CollectionSelector/PopoverTrigger";
import UserProfileEditDialog from "@/content-script/components/UserProfileEditDialog";
import useFetchCollections from "@/content-script/hooks/useFetchCollections";
import useRouter from "@/content-script/hooks/useRouter";
import { useQueryBoxStore } from "@/content-script/session-store/query-box";
import { Popover, PopoverContext } from "@/shared/components/Popover";
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

      const collection = collections?.find((x) => x.url === collectionSlug);

      if (collection == null) return;

      setSelectedCollectionUuid(collection.uuid);
    };

    autoSelect();
  }, [url, collections, setSelectedCollectionUuid]);

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
