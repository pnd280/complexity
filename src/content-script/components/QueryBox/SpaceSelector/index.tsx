import { SpaceSelectorPopoverContent } from "@/content-script/components/QueryBox/SpaceSelector/PopoverContent";
import SpaceSelectorPopoverTrigger from "@/content-script/components/QueryBox/SpaceSelector/PopoverTrigger";
import useFetchSpaces from "@/content-script/hooks/useFetchSpaces";
import usePplxAuth from "@/content-script/hooks/usePplxAuth";
import useRouter from "@/content-script/hooks/useRouter";
import { useQueryBoxStore } from "@/content-script/session-store/query-box";
import { Popover } from "@/shared/components/Popover";
import UiUtils from "@/utils/UiUtils";
import { parseUrl, whereAmI } from "@/utils/utils";

export default function SpaceSelector() {
  const { url } = useRouter();

  const { isLoggedIn } = usePplxAuth();

  const { data: spaces } = useFetchSpaces();

  const { selectedSpaceUuid, setSelectedSpaceUuid } = useQueryBoxStore(
    (state) => state,
  );

  useEffect(() => {
    UiUtils.getActiveQueryBoxTextarea({}).trigger("focus");
  }, [selectedSpaceUuid]);

  useEffect(() => {
    if (whereAmI() !== "space" || spaces == null || spaces.length < 1) return;

    const spaceSlug = parseUrl().pathname.split("/").pop();

    const space = spaces?.find(
      (x) => x.slug === spaceSlug || x.uuid === spaceSlug,
    );

    if (space == null) return;

    setSelectedSpaceUuid(space.uuid);
  }, [url, spaces, setSelectedSpaceUuid]);

  if (!isLoggedIn) return null;

  if (whereAmI() === "space" && !selectedSpaceUuid) return null;

  return (
    <Popover portal={false}>
      <SpaceSelectorPopoverTrigger
        selectedSpaceUuid={selectedSpaceUuid}
        setSelectedSpaceUuid={setSelectedSpaceUuid}
      />
      <SpaceSelectorPopoverContent
        selectedSpaceUuid={selectedSpaceUuid}
        setSelectedSpaceUuid={setSelectedSpaceUuid}
      />
    </Popover>
  );
}
