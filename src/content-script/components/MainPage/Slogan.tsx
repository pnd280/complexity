import { useDebounce, useToggle } from "@uidotdev/usehooks";

import { useInit } from "@/content-script/hooks/useInit";
import useWaitForElement from "@/content-script/hooks/useWaitForElement";
import CplxUserSettings from "@/cplx-user-settings/CplxUserSettings";
import Portal from "@/shared/components/Portal";
import { cn } from "@/utils/cn";
import { DomSelectors } from "@/utils/DomSelectors";
import { isDomNode } from "@/utils/utils";

export default function Slogan() {
  const [container, setContainer] = useState<HTMLElement>();

  const { isWebSocketCaptured } = useDebounce(useInit(), 1000);

  const [visible, toggleVisibility] = useToggle(!isWebSocketCaptured);

  const slogan =
    CplxUserSettings.get().customTheme.slogan || "Where knowledge begins";

  const { element, isWaiting } = useWaitForElement({
    id: "slogan",
    selector: DomSelectors.HOME.SLOGAN,
  });

  useEffect(() => {
    if (!isDomNode(element)) return;

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

    $nativeSlogan.addClass("!tw-opacity-100");

    setContainer($nativeSlogan[0] as HTMLElement);
  }, [element, isWaiting, slogan]);

  if (!container || !visible) return null;

  return (
    <Portal container={$(container).find("> div:first-child")[0]}>
      <div
        className={cn(
          "tw-absolute -tw-top-[2rem] tw-left-1/2 tw-hidden tw-w-fit -tw-translate-x-1/2 tw-select-none tw-items-center tw-justify-center tw-gap-1 tw-font-sans tw-text-[.8rem] tw-text-accent-foreground tw-transition-all tw-duration-300 tw-animate-in tw-fade-in md:tw-flex",
          {
            "tw-animate-out tw-fade-out tw-zoom-out tw-slide-out-to-top tw-fill-mode-forwards":
              isWebSocketCaptured,
          },
        )}
        onAnimationEnd={() => {
          if (isWebSocketCaptured) {
            toggleVisibility(false);
          }
        }}
      >
        {slogan.length > 5 && (
          <div className="tw-tracking-wide">Complexity</div>
        )}
      </div>
    </Portal>
  );
}
