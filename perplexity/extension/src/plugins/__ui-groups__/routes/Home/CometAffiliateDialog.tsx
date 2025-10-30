import { useLocalStorage } from "@uidotdev/usehooks";

import { CometCard } from "@/components/CometCard";
import PplxPro from "@/components/icons/PplxPro";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache";
import { usePluginGuardsStore } from "@/plugins/__async-deps__/plugins-guard/store";
import { cometAffiliateRemoteResourceConfig } from "@/services/externals/cplx-api/remote-resources/comet-affiliate/index.remote-resources";
import { getRemoteResource } from "@/services/externals/cplx-api/remote-resources/utils";

const cometAffiliateConfigPromise = getRemoteResource(
  cometAffiliateRemoteResourceConfig,
  persistentQueryClient,
);

export default function CometAffiliateDialog() {
  const cometAffiliateConfig = use(cometAffiliateConfigPromise);

  const isLoggedIn = usePluginGuardsStore((state) => state.isLoggedIn);
  const subTier = usePluginGuardsStore((state) => state.subTier);

  const [dismissed, setDismissed] = useLocalStorage(
    "cplx.cometAffiliateDismissed",
    false,
  );

  if (
    !cometAffiliateConfig.enabled ||
    dismissed ||
    (isLoggedIn && subTier != null)
  ) {
    return null;
  }

  return (
    <Dialog
      open={!dismissed}
      closeOnInteractOutside={false}
      closeOnEscape={false}
      onExitComplete={() => setDismissed(true)}
    >
      <DialogContent closeButton={false} className="x:md:max-w-fit">
        <DialogHeader className="x:block x:text-center x:text-xl x:md:text-left x:md:text-2xl">
          <Trans
            tKey="common.sponsorDialog.cometAffiliate.title"
            components={[
              <PplxPro className="x:mx-1 x:inline-block x:text-xl x:text-primary" />,
            ]}
          />
        </DialogHeader>

        <DialogDescription className="x:space-y-4">
          <div className="x:text-base x:text-pretty">
            <Trans
              tKey="common.sponsorDialog.cometAffiliate.description"
              components={[
                <PplxPro className="x:mx-1 x:inline-block x:text-xl x:text-primary" />,
              ]}
            />
          </div>
          <a
            href={`https://${cometAffiliateConfig.link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="x:block x:px-4"
            onClick={() => setDismissed(true)}
          >
            <CometCard rotateDepth={5} translateDepth={5}>
              <Image
                src="https://pbs.twimg.com/card_img/1978322318423162880/kT2NMCxf?format=png&name=900x900"
                alt="Comet Invitation"
                className="x:rounded-xl"
              />
            </CometCard>
          </a>
        </DialogDescription>

        <DialogFooter>
          <Button
            className="x:group x:w-full x:space-x-2"
            variant="ghostNoOutline"
            onClick={() => setDismissed(true)}
          >
            {t("common.sponsorDialog.cometAffiliate.dismissButton")}
          </Button>
          <Button
            asChild
            className="x:group shimmer-container x:w-full x:space-x-2"
            onClick={() => setDismissed(true)}
          >
            <a
              ref={(el) => {
                el?.focus();
              }}
              href={`https://${cometAffiliateConfig.link}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("common.sponsorDialog.cometAffiliate.claimButton")}
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
