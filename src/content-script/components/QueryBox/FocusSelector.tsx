import { FaFile } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { PiQuestionMark } from "react-icons/pi";

import {
  focusModeIcons,
  type FocusMode,
} from "@/content-script/components/QueryBox/";
import { focusModes } from "@/content-script/components/QueryBox/consts";
import { QueryBoxContext } from "@/content-script/components/QueryBox/context";
import useFetchSpaceFiles from "@/content-script/hooks/useFetchSpaceFiles";
import useFetchThreadInfo from "@/content-script/hooks/useFetchThreadInfo";
import { useQueryBoxStore } from "@/content-script/session-store/query-box";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/shared/components/Select";
import Tooltip from "@/shared/components/Tooltip";
import { SpaceFilesApiResponse } from "@/types/pplx-api.types";
import { isReactNode } from "@/types/utils.types";
import UiUtils from "@/utils/UiUtils";
import { parseUrl } from "@/utils/utils";

export default function FocusSelector() {
  const queryBoxContext = useContext(QueryBoxContext);

  if (!queryBoxContext) throw new Error("No context found");

  const { context, setFocusModeIncludeFiles } = queryBoxContext;

  const { data: threadInfo } = useFetchThreadInfo({
    slug: parseUrl().pathname.split("/").pop() || "",
    enabled: context === "follow-up",
  });

  const { focusMode, setFocusMode } = useQueryBoxStore((state) => state);

  const queryBoxSelectedSpaceUuid = useQueryBoxStore(
    (state) => state.selectedSpaceUuid,
  );

  const currentSpaceUuid =
    context === "main"
      ? queryBoxSelectedSpaceUuid
      : threadInfo?.[0].collection_info?.uuid || "";

  const {
    files,
    query: { isFetching, isError },
  } = useFetchSpaceFiles({ spaceUuid: currentSpaceUuid });

  useEffect(() => {
    if (currentSpaceUuid && files && files.length) {
      setFocusModeIncludeFiles?.(true);

      enableProSearch();

      return;
    }

    setFocusModeIncludeFiles?.(false);
  }, [currentSpaceUuid, files, setFocusModeIncludeFiles]);

  useEffect(() => {
    UiUtils.getActiveQueryBoxTextarea({}).trigger("focus");
  }, [focusMode]);

  if (!focusMode) return null;

  return (
    <Select
      items={focusModes.map((model) => model.code)}
      value={[(focusMode || "internet") as FocusMode["code"]]}
      onValueChange={(details) => {
        setFocusMode(details.value[0] as FocusMode["code"]);

        UiUtils.getActiveQueryBoxTextarea({}).trigger("focus");
      }}
    >
      <SelectTrigger
        variant="ghost"
        className={cn(
          "gap-1 tw-flex tw-h-full tw-min-h-8 !tw-w-fit tw-max-w-[150px] tw-select-none tw-items-center tw-justify-center !tw-px-2 !tw-py-0 tw-font-medium tw-transition-all tw-duration-300 tw-animate-in tw-fade-in active:!tw-scale-95 [&_span]:tw-max-w-[100px]",
        )}
      >
        <Tooltip
          content={`Focus: ${focusModes.find((model) => model.code === focusMode)?.label}`}
          positioning={{
            gutter: 15,
          }}
        >
          <div className="relative">{focusModeIcons[focusMode]}</div>
        </Tooltip>
      </SelectTrigger>
      <SelectContent className="tw-max-h-[500px] tw-min-w-[130px] tw-max-w-[200px] tw-items-center tw-font-sans">
        {currentSpaceUuid && (
          <MiscOptions
            isFetching={isFetching}
            isError={isError}
            files={files}
          />
        )}
        <SelectGroup>
          {files && files.length > 0 && <SelectLabel>Focus</SelectLabel>}
          {focusModes.map((item) => (
            <SelectItem key={item.code} item={item.code}>
              <div className="tw-flex tw-max-w-full tw-items-center tw-justify-around tw-gap-2">
                {isReactNode(focusModeIcons[item.code]) ? (
                  <div>{focusModeIcons[item.code]}</div>
                ) : (
                  <PiQuestionMark className="tw-size-4" />
                )}
                <span className="tw-truncate">{item.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function MiscOptions({
  isFetching,
  isError,
  files,
}: {
  isFetching: boolean;
  isError: boolean;
  files?: SpaceFilesApiResponse["files"];
}) {
  const queryBoxContext = useContext(QueryBoxContext);

  if (!queryBoxContext) throw new Error("No context found");

  const { focusModeIncludeFiles, setFocusModeIncludeFiles } = queryBoxContext;

  if (isError || isFetching || files?.length === 0) return null;

  return (
    <SelectGroup>
      <SelectLabel>Space</SelectLabel>
      <div
        className={cn(
          "tw-flex tw-w-full tw-max-w-full tw-cursor-pointer tw-items-center tw-justify-between tw-gap-2 tw-rounded-md tw-p-2 hover:tw-bg-accent hover:tw-text-accent-foreground",
          {
            "tw-text-accent-foreground": focusModeIncludeFiles,
          },
        )}
        onClick={(e) => {
          e.stopPropagation();
          setFocusModeIncludeFiles(!focusModeIncludeFiles);

          if (!focusModeIncludeFiles) {
            enableProSearch();
          }
        }}
      >
        <div className="tw-flex tw-items-center tw-gap-2">
          <FaFile className="tw-size-4" />
          <span className="tw-select-none tw-truncate tw-text-sm">Files</span>
        </div>
        {focusModeIncludeFiles && (
          <div>
            <FaCircleCheck className="tw-size-3" />
          </div>
        )}
      </div>
    </SelectGroup>
  );
}

function enableProSearch() {
  const proSearchToggle = UiUtils.getProSearchToggle();

  if (
    proSearchToggle.length &&
    proSearchToggle.attr("data-state") === "unchecked"
  ) {
    proSearchToggle.trigger("click");
  }
}
