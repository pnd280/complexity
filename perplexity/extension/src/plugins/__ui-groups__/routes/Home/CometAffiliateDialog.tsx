import { useLocalStorage } from "@uidotdev/usehooks";

import CometAffiliateCard from "@/components/CometAffiliateCard";
import PplxPro from "@/components/icons/PplxPro";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { usePluginGuardsStore } from "@/plugins/__async-deps__/plugins-guard/store";

export default function CometAffiliateDialog() {
  const isLoggedIn = usePluginGuardsStore((state) => state.isLoggedIn);
  const subTier = usePluginGuardsStore((state) => state.subTier);

  const [dismissed, setDismissed] = useLocalStorage(
    "cplx.cometAffiliateDismissed",
    false,
  );

  if (dismissed || isLoggedIn == null || (isLoggedIn && subTier != null)) {
    return null;
  }

  return (
    <Dialog
      open={!dismissed}
      closeOnInteractOutside={false}
      closeOnEscape={false}
      onExitComplete={() => setDismissed(true)}
    >
      <DialogContent closeButton={false}>
        <DialogHeader className="x:block x:text-center x:text-xl x:md:text-left x:md:text-2xl">
          <Trans
            tKey="common.sponsorDialog.cometAffiliate.title"
            components={[
              <PplxPro className="x:mx-1 x:inline-block x:text-xl x:text-primary" />,
            ]}
          />
        </DialogHeader>

        <div className="x:text-base x:text-pretty">
          <Trans
            tKey="common.sponsorDialog.cometAffiliate.description"
            components={[
              <PplxPro className="x:mx-1 x:inline-block x:text-xl x:text-primary" />,
            ]}
          />
        </div>

        <div onClick={() => setDismissed(true)}>
          <CometAffiliateCard />
        </div>

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
              href="https://pplx.ai/pnd280"
              target="_blank"
              rel="noreferrer"
            >
              {t("common.sponsorDialog.cometAffiliate.claimButton")}
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
