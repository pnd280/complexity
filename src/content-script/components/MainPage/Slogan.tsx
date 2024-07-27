import { useDebounce, useToggle } from "@uidotdev/usehooks";
import $ from "jquery";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import ReactDom from "react-dom";

import useWaitForElement from "@/content-script/hooks/useWaitForElement";
import { useGlobalStore } from "@/content-script/session-store/global";
import CplxUserSettings from "@/lib/CplxUserSettings";
import useExtensionUpdate from "@/shared/hooks/useExtensionUpdate";
import BackgroundScript from "@/utils/BackgroundScript";
import { cn } from "@/utils/cn";
import { isDomNode } from "@/utils/utils";

export default function Slogan() {
  const { newVersionAvailable } = useExtensionUpdate({});

  const [container, setContainer] = useState<Element>();

  const isReady = useDebounce(
    useGlobalStore(
      (state) => state.isWebSocketCaptured || state.isLongPollingCaptured,
    ),
    1000,
  );

  const [visible, toggleVisibility] = useToggle(!isReady);

  const slogan =
    CplxUserSettings.get().customTheme.slogan || "Where knowledge begins";

  const { element, isWaiting } = useWaitForElement({
    id: "slogan",
    selector: ".mb-lg.flex.items-center.justify-center.pb-xs.md\\:text-center",
  });

  useEffect(() => {
    if (!isDomNode(element) || !$(element).length) return;

    const $nativeSlogan = $(element);

    if (!$nativeSlogan.length) return;

    $nativeSlogan
      .find("> div:first-child")
      .addClass("tw-relative")
      .find("span:first")
      .addClass(
        "text-shadow-hover tw-select-none !tw-leading-[1.2rem] tw-transition-all tw-duration-300 tw-ease-in-out hover:tw-tracking-wide",
      )
      .text(slogan);

    $nativeSlogan.addClass("!tw-opacity-100 tw-transition-all tw-duration-300");

    setContainer($nativeSlogan[0]);
  }, [element, isWaiting, slogan]);

  if (!container) return null;

  return (
    <>
      {ReactDom.createPortal(
        <>
          {visible && (
            <div
              className={cn(
                "tw-absolute -tw-top-[2rem] tw-left-1/2 tw-flex tw-w-fit -tw-translate-x-1/2 tw-select-none tw-items-center tw-justify-center tw-gap-1 tw-font-sans tw-text-[.8rem] tw-text-accent-foreground tw-transition-all tw-duration-300 tw-animate-in tw-fade-in",
                {
                  "tw-animate-out tw-fade-out tw-zoom-out tw-slide-out-to-top tw-fill-mode-forwards":
                    isReady,
                },
              )}
              onAnimationEnd={() => {
                if (isReady) {
                  toggleVisibility(false);
                }
              }}
            >
              {slogan.length > 5 && (
                <div className="tw-flex tw-items-center tw-gap-1">
                  <LoaderCircle className="tw-size-2 tw-animate-spin" />
                  <span>Complexity</span>
                </div>
              )}
            </div>
          )}
        </>,
        $(container).find("> div:first-child")[0],
      )}
      {newVersionAvailable &&
        ReactDom.createPortal(
          <div
            className="tw-fixed tw-bottom-20 tw-cursor-pointer tw-select-none tw-font-sans"
            onClick={() => {
              BackgroundScript.sendMessage({ action: "openChangelog" });
            }}
          >
            <div>
              A new version of{" "}
              <span className="tw-font-bold tw-text-accent-foreground">
                Complexity
              </span>{" "}
              is available
            </div>
            <div className="tw-absolute -tw-right-3 tw-top-0 tw-size-2 tw-animate-ping tw-rounded-full tw-bg-accent-foreground"></div>
            <div className="tw-absolute -tw-right-3 tw-top-0 tw-size-2 tw-rounded-full tw-bg-accent-foreground"></div>
          </div>,
          container,
        )}
    </>
  );
}
