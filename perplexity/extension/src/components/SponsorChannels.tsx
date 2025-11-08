import { Button } from "@/components/ui/button";

import Fa7BrandsPaypal from "~icons/fa7-brands/paypal";
import SimpleIconsKofi from "~icons/simple-icons/kofi";
import TablerMail from "~icons/tabler/mail";

export default function SponsorChannels() {
  return (
    <>
      <div className="x:w-full x:space-y-2">
        <div className="x:text-muted-foreground">
          {t("common.sponsorDialog.donation.title")}
        </div>
        <div className="x:flex x:flex-col x:gap-2">
          <Button asChild>
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
          <Button asChild>
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
      <div className="x:w-full x:space-y-2">
        <div className="x:text-muted-foreground">
          {t("common.sponsorDialog.sponsorship.title")}
        </div>
        <Button asChild className="x:group x:w-full">
          <a href="mailto:pnd280@gmail.com" target="_blank" rel="noreferrer">
            <span className="x:flex x:items-center x:gap-2 x:group-hover:hidden">
              <TablerMail className="x:size-6" />
              <span>{t("common.sponsorDialog.sponsorship.contactEmail")}</span>
            </span>
            <span className="x:hidden x:animate-in x:fade-in-0 x:group-hover:block x:group-hover:text-primary">
              pnd280@gmail.com
            </span>
          </a>
        </Button>
      </div>
    </>
  );
}
