import { CircleAlert } from 'lucide-react';

import { Separator } from '@radix-ui/react-separator';

export default function UntrustedBuildWarning() {
  return (
    <div className="tw-w-full tw-bg-secondary tw-flex tw-flex-col tw-font-sans">
      <Separator />
      <div className="tw-flex tw-px-2 tw-py-2 tw-text-sm tw-font-bold tw-gap-1 tw-bg-destructive tw-items-center">
        <CircleAlert className="tw-h-8 tw-w-8 tw-mr-1 tw-text-accent-foreground" />
        <span>This is an untrusted build. Use at your own risk.</span>
      </div>
    </div>
  );
}
