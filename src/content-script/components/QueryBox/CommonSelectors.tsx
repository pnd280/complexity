import { LoaderCircle } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

import CollectionSelector from "@/content-script/components/QueryBox/CollectionSelector";
import FocusSelector from "@/content-script/components/QueryBox/FocusSelector";
import LanguageModelSelector from "@/content-script/components/QueryBox/LanguageModelSelector";
import Separator from "@/shared/components/Separator";
import { isReactNode } from "@/types/utils.types";

export default function CommonSelectors({
  isReady,
  hasActivePplxSub,
  focus,
  collection,
  languageModel,
}: {
  isReady: boolean;
  hasActivePplxSub: boolean;
  focus: boolean;
  collection?: boolean;
  languageModel: boolean;
}) {
  const [hint, setHint] = useState<ReactNode>("");

  useEffect(() => {
    setTimeout(() => {
      if (!isReady) {
        setHint(
          <span className="tw-flex tw-flex-wrap tw-items-baseline tw-gap-1">
            This is taking longer than expected...
          </span>,
        );
      }
    }, 5000);
  }, [isReady]);

  return (
    <div className="tw-flex tw-items-center">
      {isReady ? (
        <>
          {(focus || collection) && (
            <>
              {focus && <FocusSelector />}
              {collection && <CollectionSelector />}
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
        </>
      ) : (
        <div className="tw-mx-2 tw-flex tw-items-center tw-gap-2">
          <LoaderCircle className="tw-size-4 tw-animate-spin tw-text-muted-foreground" />
          {isReactNode(hint) && (
            <span className="tw-text-xs tw-text-muted-foreground tw-animate-in tw-fade-in tw-slide-in-from-right">
              {hint}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
