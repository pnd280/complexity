import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Fa7BrandsPaypal from "~icons/fa7-brands/paypal";
import SimpleIconsKofi from "~icons/simple-icons/kofi";
import TablerMail from "~icons/tabler/mail";

export default function SponsorDialogWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent portal={false}>
        <div className="x:absolute x:inset-0 x:-z-10 x:bg-gradient-to-b x:from-primary/20 x:to-transparent" />

        <DialogHeader>
          <DialogTitle className="x:text-2xl">
            {t("common.sponsorDialog.title")}
          </DialogTitle>
          <DialogDescription className="x:text-foreground">
            <div className="x:flex x:flex-col x:gap-2">
              <div>{t("common.sponsorDialog.description")}</div>
              <div>{t("common.sponsorDialog.descriptionLine2")}</div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="x:w-full x:space-y-2">
          <div className="x:text-muted-foreground">
            {t("common.sponsorDialog.donation.title")}
          </div>
          <div className="x:flex x:flex-col x:gap-2">
            <Button asChild className="x:space-x-2">
              <a
                href="https://paypal.me/pnd280"
                target="_blank"
                rel="noreferrer"
                className="x:flex x:items-center x:gap-2"
              >
                <Fa7BrandsPaypal className="x:size-6" />
                <span>PayPal</span>
              </a>
            </Button>
            <Button asChild className="x:space-x-2">
              <a
                href="https://ko-fi.com/pnd280"
                target="_blank"
                rel="noreferrer"
                className="x:flex x:items-center x:gap-2"
              >
                <SimpleIconsKofi className="x:size-6" />
                <span>Ko-fi</span>
              </a>
            </Button>
          </div>
        </div>
        <div className="x:mt-4 x:w-full x:space-y-2">
          <div className="x:text-muted-foreground">
            {t("common.sponsorDialog.sponsorship.title")}
          </div>
          <Button asChild className="x:group x:w-full x:space-x-2">
            <a href="mailto:pnd280@gmail.com" target="_blank" rel="noreferrer">
              <span className="x:flex x:items-center x:gap-2 x:group-hover:hidden">
                <TablerMail className="x:size-6" />
                <span>
                  {t("common.sponsorDialog.sponsorship.contactEmail")}
                </span>
              </span>
              <span className="x:hidden x:animate-in x:fade-in-0 x:group-hover:block x:group-hover:text-primary">
                pnd280@gmail.com
              </span>
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
