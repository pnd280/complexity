import useWaitForElement from "@/content-script/hooks/useWaitForElement";
import Portal from "@/shared/components/Portal";
import useExtensionUpdate from "@/shared/hooks/useExtensionUpdate";
import BackgroundScript from "@/utils/BackgroundScript";

export default function NewVersionAnnouncer() {
  const { newVersionAvailable } = useExtensionUpdate({});

  const { element: container, isWaiting } = useWaitForElement({
    id: "mainPage",
    selector() {
      return $(
        ".mx-auto.h-full.w-full.max-w-screen-md.px-md.md\\:px-lg>:first-child",
      )[0];
    },
    timeout: 5000,
  });

  if (isWaiting || !newVersionAvailable) return null;

  return (
    <Portal container={container as HTMLElement}>
      <div
        className="tw-absolute tw-bottom-20 tw-left-1/2 -tw-translate-x-1/2 tw-cursor-pointer tw-select-none tw-font-sans tw-animate-in tw-fade-in tw-zoom-in tw-slide-in-from-bottom"
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
      </div>
    </Portal>
  );
}
