import { useQuery } from "@tanstack/react-query";
import semver from "semver";

import { APP_CONFIG } from "@/app.config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import { CplxVersionsService } from "@/services/externals/cplx-api/remote-resources/versions";
import { ContentScriptBgUtilsService } from "@/services/features/content-script-utils/service-init.bg-worker";

import TablerArrowRight from "~icons/tabler/arrow-right";
import TablerArrowUpRight from "~icons/tabler/arrow-up-right";

export default function ExtensionUpdateInfoDialogWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: versions } = useQuery({
    ...CplxVersionsService.query,
  });

  const { data: changelogListing } = useQuery(
    cplxApiQueries.changelog.listing.detail(),
  );

  if (!versions) return null;

  const latestVersion = versions.latest;
  const latestVersionWithChangelog =
    Object.keys(changelogListing ?? {}).find((version) =>
      semver.lte(version, latestVersion),
    ) ?? Object.keys(changelogListing ?? {})[0]!;

  return (
    <Dialog>
      <DialogTrigger className="x:w-full">{children}</DialogTrigger>
      <DialogContent className="x:max-h-[80vh] x:overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            A new version of the extension is available!
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div>Please update to receive enhancements and bug fixes.</div>
          <div className="x:mt-4 x:flex x:flex-col x:gap-2">
            <div className="x:mx-auto x:my-4 x:flex x:items-center x:gap-2">
              <div className="">{APP_CONFIG.VERSION}</div>
              <TablerArrowRight className="x:size-4 x:text-muted-foreground" />
              <div
                className="x:flex x:cursor-pointer x:items-center x:gap-1 x:text-3xl x:font-semibold x:text-primary x:underline x:decoration-dashed x:underline-offset-4"
                onClick={() => {
                  void ContentScriptBgUtilsService.Instance.openFullScreenReleaseNotes(
                    {
                      version: latestVersionWithChangelog,
                    },
                  );
                }}
              >
                <div>{latestVersion}</div>
                <TablerArrowUpRight className="x:size-5" />
              </div>
            </div>

            <div className="x:space-y-2">
              <div className="x:wrap-break-word x:hyphens-auto">
                The upgrade should be happening automatically when you restart
                the browser, or force it to manually update in{" "}
                <ExtensionManagementPageLink />
                {APP_CONFIG.BROWSER === "firefox" ? (
                  <span> =&gt; Complexity.</span>
                ) : (
                  ` (remember to turn on Developer mode).`
                )}
              </div>
              <div className="x:w-full x:overflow-hidden x:rounded-xl x:border x:border-border/50 x:shadow-lg">
                <Image
                  src={
                    APP_CONFIG.BROWSER === "chrome"
                      ? "https://i.imgur.com/IMLecmp.png"
                      : "https://i.imgur.com/f2x3Mtl.png"
                  }
                  alt="extension-management-page"
                  className="x:size-full x:object-cover"
                />
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

function ExtensionManagementPageLink() {
  return (
    <div
      role="link"
      className="x:inline-block x:cursor-pointer x:text-primary x:underline"
      onClick={() => {
        void ContentScriptBgUtilsService.Instance.openExtensionsManagementPage();
      }}
    >
      {APP_CONFIG.BROWSER === "chrome" ? "chrome://extensions" : "about:addons"}
    </div>
  );
}
