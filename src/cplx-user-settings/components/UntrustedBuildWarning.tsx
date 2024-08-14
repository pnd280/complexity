import { CircleAlert } from "lucide-react";

import Separator from "@/shared/components/Separator";

export default function UntrustedBuildWarning() {
  return (
    <div className="tw-flex tw-w-full tw-flex-col tw-bg-secondary tw-font-sans">
      <Separator />
      <div className="tw-flex tw-items-center tw-gap-1 tw-bg-destructive tw-px-2 tw-py-2 tw-text-sm tw-font-bold">
        <CircleAlert className="tw-mr-1 tw-h-8 tw-w-8 tw-text-accent-foreground" />
        <span>This is an untrusted build. Use at your own risk.</span>
      </div>
    </div>
  );
}
