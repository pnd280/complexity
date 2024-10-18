import { LuLoader2 as LoaderCircle } from "react-icons/lu";

import FocusSelector from "@/content-script/components/QueryBox/FocusSelector";
import LanguageModelSelector from "@/content-script/components/QueryBox/LanguageModelSelector";
import SpaceSelector from "@/content-script/components/QueryBox/SpaceSelector";
import Separator from "@/shared/components/Separator";

export default function CommonSelectors({
  isReady,
  hasActivePplxSub,
  focus,
  space,
  languageModel,
}: {
  isReady: boolean;
  hasActivePplxSub: boolean;
  focus: boolean;
  space?: boolean;
  languageModel: boolean;
}) {
  if (!isReady) {
    return (
      <div className="tw-mx-2 tw-flex tw-items-center tw-gap-2">
        <LoaderCircle className="tw-size-4 tw-animate-spin tw-text-muted-foreground" />
        <span className="tw-text-xs tw-text-muted-foreground tw-animate-in tw-fade-in tw-slide-in-from-right">
          Initializing...
        </span>
      </div>
    );
  }

  return (
    <div className="tw-flex tw-items-center">
      {(focus || space) && (
        <>
          {focus && <FocusSelector />}
          {space && <SpaceSelector />}
          {hasActivePplxSub && languageModel && (
            <div className="tw-my-auto tw-flex tw-h-8 tw-items-center">
              <Separator
                orientation="vertical"
                className="tw-mx-2 !tw-h-[60%] tw-animate-in tw-fade-in"
              />
            </div>
          )}
        </>
      )}
      {hasActivePplxSub && languageModel && <LanguageModelSelector />}
    </div>
  );
}
