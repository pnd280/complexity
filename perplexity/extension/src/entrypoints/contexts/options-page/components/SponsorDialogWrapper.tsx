import SponsorChannels from "@/components/SponsorChannels";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useViewport } from "@/hooks/useViewport";

export default function SponsorDialogWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent portal={!useViewport((store) => store.isMobile)}>
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
              <SponsorChannels />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
