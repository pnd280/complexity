import { useLocalStorage } from "@uidotdev/usehooks";

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

  if (dismissed || (isLoggedIn && subTier != null)) {
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
        <DialogHeader className="x:block">
          <Trans
            tKey="common.sponsorDialog.cometAffiliate.title"
            components={[
              <span className="x:inline-block x:font-medium x:text-primary" />,
            ]}
          />
        </DialogHeader>

        <div>
          <Trans
            tKey="common.sponsorDialog.cometAffiliate.description"
            components={[
              <span
                key="affiliateMessageDescription"
                className="x:inline-block x:font-medium x:text-primary"
              />,
            ]}
          />
        </div>

        <DialogFooter>
          <Button
            className="x:group x:w-full x:space-x-2"
            variant="outline"
            onClick={() => setDismissed(true)}
          >
            {t("common.sponsorDialog.cometAffiliate.dismissButton")}
          </Button>
          <Button
            asChild
            className="x:group x:w-full x:space-x-2"
            variant="primary"
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
