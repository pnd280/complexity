import { FaDiscord } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/shared/components/HoverCard";
import Cplx from "@/shared/components/icons/Cplx";
import FlagVietnam from "@/shared/components/icons/FlagVietnam";
import { toast } from "@/shared/toast";
import packageData from "@@/package.json";

export default function About() {
  return (
    <div className="tw-flex tw-h-full tw-w-full tw-flex-col tw-items-center tw-justify-center tw-gap-4">
      <div className="tw-flex tw-flex-col tw-items-center">
        <div className="tw-text-center">
          <Cplx className="tw-mx-auto tw-h-16 tw-w-16 tw-text-accent-foreground tw-transition-colors" />
          <div>Complexity</div>
          <div className="tw-w-max tw-font-mono tw-text-xs tw-text-muted-foreground">
            {packageData.version}-PUBLIC-BETA
          </div>
        </div>
        <div className="tw-mt-4 tw-text-center">
          <div className="tw-text-xl">Made with 💖 by the community</div>
          <div className="tw-text-xs">
            Maintained by{" "}
            <HoverCard portal={false} openDelay={0} closeDelay={200}>
              <HoverCardTrigger asChild>
                <div className="tw-inline tw-cursor-pointer tw-underline">
                  pnd280 <FlagVietnam className="tw-inline tw-size-4" />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="tw-text-left tw-font-sans">
                <div>Reach me at:</div>
                <div className="tw-ml-14 tw-font-mono">
                  <div>
                    <FaDiscord className="tw-mr-1 tw-inline tw-size-4" />{" "}
                    <div
                      className="tw-inline tw-cursor-pointer tw-underline"
                      onClick={() => {
                        toast({
                          description: "Copied",
                        });
                        navigator.clipboard.writeText("feline9655");
                      }}
                    >
                      feline9655
                    </div>
                  </div>
                  <div>
                    <SiGmail className="tw-mr-1 tw-inline tw-size-4" />{" "}
                    <div
                      className="tw-inline tw-cursor-pointer tw-underline"
                      onClick={() => {
                        toast({
                          description: "Copied",
                        });
                        navigator.clipboard.writeText("pnd280@gmail.com");
                      }}
                    >
                      pnd280@gmail.com
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
    </div>
  );
}
