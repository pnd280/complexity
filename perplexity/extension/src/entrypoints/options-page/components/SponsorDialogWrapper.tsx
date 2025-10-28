import PplxPro from "@/components/icons/PplxPro";
import SponsorChannels from "@/components/SponsorChannels";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { persistentQueryClient } from "@/entrypoints/options-page/persistent-query-client";
import { useIsMobileStore } from "@/hooks/is-mobile-store";
import { cometAffiliateRemoteResourceConfig } from "@/services/externals/cplx-api/remote-resources/comet-affiliate/index.remote-resources";
import { getRemoteResource } from "@/services/externals/cplx-api/remote-resources/utils";

import TablerLink from "~icons/tabler/link";

const cometAffiliateConfig = await getRemoteResource(
  cometAffiliateRemoteResourceConfig,
  persistentQueryClient,
);

export default function SponsorDialogWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent portal={!useIsMobileStore().isMobile}>
        <div className="x:absolute x:inset-0 x:-z-10 x:bg-linear-to-b x:from-primary/20 x:to-transparent" />

        <DialogHeader>
          <DialogTitle className="x:text-2xl">
            {t("common.sponsorDialog.title")}
          </DialogTitle>
          <DialogDescription className="x:text-foreground">
            <div className="x:flex x:flex-col x:gap-2">
              <div>{t("common.sponsorDialog.description")}</div>
              <div>{t("common.sponsorDialog.descriptionLine2")}</div>
            </div>
            <div className="x:mt-4 x:flex x:flex-col x:gap-4">
              {cometAffiliateConfig.enabled && (
                <div className="x:w-full x:space-y-2">
                  <div className="x:text-muted-foreground">
                    <Trans
                      tKey="common.sponsorDialog.cometAffiliate.title"
                      components={[
                        <PplxPro className="x:mx-1 x:inline-block x:text-xl x:text-primary" />,
                      ]}
                    />
                  </div>
                  <Button asChild className="x:group x:w-full x:space-x-2">
                    <a
                      href={`https://${cometAffiliateConfig.link}`}
                      target="_blank"
                      rel="noreferrer"
                      className="x:flex x:items-center"
                    >
                      <TablerLink className="x:size-6" />
                      <span>{cometAffiliateConfig.link}</span>
                    </a>
                  </Button>
                </div>
              )}

              <SponsorChannels />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
