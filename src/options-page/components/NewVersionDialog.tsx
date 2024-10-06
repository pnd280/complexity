import {
  LuArrowRight as ArrowRight,
  LuExternalLink as ExternalLink,
} from "react-icons/lu";

import useExtensionUpdate from "@/shared/hooks/useExtensionUpdate";
import packageData from "~/package.json";

const version = packageData.version;

export function NewVersionDialog() {
  const { newVersionAvailable, newVersion } = useExtensionUpdate({});

  if (!newVersionAvailable) return null;

  return (
    <div className="tw-fixed tw-bottom-10 tw-left-1/2 tw-w-max -tw-translate-x-1/2">
      <div className="tw-rounded-md tw-border !tw-border-accent-foreground tw-bg-background tw-p-2 tw-px-4 tw-text-center tw-font-sans tw-text-foreground tw-shadow-2xl tw-transition-all tw-animate-in tw-slide-in-from-bottom hover:tw-scale-105 hover:tw-shadow-accent-foreground">
        <div className="tw-text-3xl tw-font-bold">
          A New Version is Available!
        </div>
        <div className="tw-flex tw-items-center tw-justify-center tw-gap-2 tw-font-mono">
          <div className="">{version}</div>
          <ArrowRight className="tw-size-4" />
          <div className="tw-text-lg tw-font-bold tw-text-accent-foreground">
            {newVersion}
          </div>
        </div>
        <div className="tw-flex tw-items-center tw-justify-center tw-gap-2">
          <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-1">
            <div>Restart the browser to trigger the auto-update.</div>
            <div className="tw-flex tw-items-center tw-gap-1">
              Not working?{" "}
              <a
                className="tw-flex tw-items-center tw-gap-1 tw-underline"
                href="https://addons.mozilla.org/en-US/firefox/addon/complexity/"
                target="_blank"
                rel="noreferrer"
              >
                Reinstall
                <ExternalLink className="tw-size-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
