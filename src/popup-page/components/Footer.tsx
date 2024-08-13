import { Zap } from "lucide-react";

import Separator from "@/shared/components/Separator";
import Tooltip from "@/shared/components/Tooltip";
import { cn } from "@/utils/cn";
import packageData from "@@/package.json";

const version = `beta-${packageData.version}`;

export default function Footer() {
  return (
    <div className="tw-flex tw-w-full tw-flex-col tw-bg-secondary tw-font-sans">
      <Separator />
      <div className="tw-flex tw-px-2">
        <div className="tw-flex tw-items-center tw-py-2 tw-text-sm tw-font-bold">
          <span>Complexity</span>
          <Zap className="tw-mx-1 tw-h-3 tw-w-3 tw-text-accent-foreground" />
          <Tooltip content="Discord: feline9655">
            <div className="!tw-min-w-max tw-truncate tw-text-secondary-foreground">
              by <span className="tw-underline">pnd280</span>
            </div>
          </Tooltip>
        </div>
        <div
          id="complexity-version"
          title={version}
          className={cn(
            "tw-ml-auto tw-self-center tw-truncate tw-rounded-md tw-border tw-bg-background tw-px-2 tw-py-1 tw-font-mono tw-text-[.6rem] tw-text-xs tw-font-bold tw-text-foreground",
          )}
        >
          {version}
        </div>
      </div>
    </div>
  );
}
