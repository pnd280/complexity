import { createListCollection } from "@ark-ui/react";
import { FaBuilding, FaFile } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { PiQuestionMark } from "react-icons/pi";

import {
  focusModeIcons,
  type FocusMode,
} from "@/content-script/components/QueryBox/";
import { focusModes } from "@/content-script/components/QueryBox/consts";
import { QueryBoxContext } from "@/content-script/components/QueryBox/context";
import useFetchOrgSettings from "@/content-script/hooks/useFetchOrgSettings";
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

  const {
    type,
    setIncludeSpaceFiles,
    includeOrgFiles,
    includeSpaceFiles,
    focusMode,
    setFocusMode,
  } = queryBoxContext;

  const { data: threadInfo } = useFetchThreadInfo({
    slug: parseUrl().pathname.split("/").pop() || "",
    enabled: type === "follow-up",
  });

  const currentFocusMode =
    type === "main" ? focusMode : threadInfo?.[0].search_focus;

  const queryBoxSelectedSpaceUuid = useQueryBoxStore(
    (state) => state.selectedSpaceUuid,
  );

  const currentSpaceUuid =
    type === "main"
      ? queryBoxSelectedSpaceUuid
      : threadInfo?.[0].collection_info?.uuid || "";

  const { files } = useFetchSpaceFiles({ spaceUuid: currentSpaceUuid });

  const { data: orgSettings } = useFetchOrgSettings();

  const hasFiles =
    (files && files.length > 0) || orgSettings?.is_in_organization;

  const includeFiles = hasFiles && (includeOrgFiles || includeSpaceFiles);

  useEffect(() => {
    if (currentSpaceUuid && files && files.length) {
      setIncludeSpaceFiles?.(true);

      enableProSearch();

      return;
    }
  }, [currentSpaceUuid, files, setIncludeSpaceFiles]);

  useEffect(() => {
    UiUtils.getActiveQueryBoxTextarea({}).trigger("focus");
  }, [focusMode]);

  if (type === "follow-up" && !hasFiles) return null;

  return (
    <Select
      collection={createListCollection({
        items: focusModes.map((model) => model.code),
      })}
      value={[(focusMode || "internet") as FocusMode["code"]]}
      lazyMount={false}
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
          content={`Focus: ${focusModes.find((model) => model.code === currentFocusMode)?.label}${includeFiles ? " (with " + (includeOrgFiles ? "org" : "space") + " files)" : ""}`}
          positioning={{
            gutter: 15,
          }}
        >
          <div className="tw-flex tw-items-center tw-gap-2">
            <div className="relative">
              {focusModeIcons[currentFocusMode ?? "internet"]}
            </div>
            {orgSettings?.is_in_organization && includeOrgFiles && (
              <div className="tw-text-accent-foreground">
                <FaBuilding className="tw-size-3" />
              </div>
            )}
            {files && files.length > 0 && includeSpaceFiles && (
              <div className="tw-text-accent-foreground">
                <FaFile className="tw-size-3" />
              </div>
            )}
          </div>
        </Tooltip>
      </SelectTrigger>
      <SelectContent className="tw-max-h-[500px] tw-min-w-[130px] tw-max-w-[200px] tw-items-center tw-font-sans">
        <MiscOptions files={files} />
        <SelectGroup>
          {((files && files.length > 0) || orgSettings?.is_in_organization) && (
            <SelectLabel>Focus</SelectLabel>
          )}
          {focusModes
            .filter(
              (item) => type !== "follow-up" || item.code === currentFocusMode,
            )
            .map((item) => (
              <SelectItem
                key={item.code}
                item={item.code}
                className={cn({
                  "tw-cursor-not-allowed !tw-bg-background !tw-text-foreground":
                    type === "follow-up",
                })}
              >
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

function MiscOptions({ files }: { files?: SpaceFilesApiResponse["files"] }) {
  const queryBoxContext = useContext(QueryBoxContext);

  if (!queryBoxContext) throw new Error("No context found");

  const { includeSpaceFiles, setIncludeSpaceFiles } = queryBoxContext;

  const { includeOrgFiles, setIncludeOrgFiles } = queryBoxContext;

  const { data: orgSettings } = useFetchOrgSettings();

  return (
    <SelectGroup>
      {orgSettings?.is_in_organization && (
        <>
          <SelectLabel>Organization</SelectLabel>
          <div
            className={cn(
              "tw-flex tw-w-full tw-max-w-full tw-cursor-pointer tw-items-center tw-justify-between tw-gap-2 tw-rounded-md tw-p-2 hover:tw-bg-accent hover:tw-text-accent-foreground",
              {
                "tw-text-accent-foreground": includeOrgFiles,
              },
            )}
            onClick={(e) => {
              e.stopPropagation();
              setIncludeOrgFiles(!includeOrgFiles);

              if (!includeOrgFiles) {
                enableProSearch();
              }
            }}
          >
            <div className="tw-flex tw-items-center tw-gap-2">
              <FaFile className="tw-size-4" />
              <span className="tw-select-none tw-truncate tw-text-sm">
                Files
              </span>
            </div>
            {includeOrgFiles && (
              <div>
                <FaCircleCheck className="tw-size-3" />
              </div>
            )}
          </div>
        </>
      )}

      {files && files.length > 0 && (
        <>
          <SelectLabel>Space</SelectLabel>
          <div
            className={cn(
              "tw-flex tw-w-full tw-max-w-full tw-cursor-pointer tw-items-center tw-justify-between tw-gap-2 tw-rounded-md tw-p-2 hover:tw-bg-accent hover:tw-text-accent-foreground",
              {
                "tw-text-accent-foreground": includeSpaceFiles,
              },
            )}
            onClick={(e) => {
              e.stopPropagation();
              setIncludeSpaceFiles(!includeSpaceFiles);

              if (!includeSpaceFiles) {
                enableProSearch();
              }
            }}
          >
            <div className="tw-flex tw-items-center tw-gap-2">
              <FaFile className="tw-size-4" />
              <span className="tw-select-none tw-truncate tw-text-sm">
                Files
              </span>
            </div>
            {includeSpaceFiles && (
              <div>
                <FaCircleCheck className="tw-size-3" />
              </div>
            )}
          </div>
        </>
      )}
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
