import { ArrowRight, ExternalLink } from 'lucide-react';

import useExtensionUpdate from '@/shared/hooks/useExtensionUpdate';

import packageData from '../../../package.json';

const version = packageData.version;

export function NewVersionDialog() {
  const { newVersionAvailable, newVersion } = useExtensionUpdate({});

  if (!newVersionAvailable) return null;

  return (
    <div className="tw-fixed tw-bottom-10 tw-left-1/2 -tw-translate-x-1/2 tw-w-max">
      <div className="tw-font-sans tw-bg-background tw-text-foreground tw-p-2 tw-px-4 tw-rounded-md tw-border !tw-border-accent-foreground tw-animate-in tw-slide-in-from-bottom tw-transition-all hover:tw-scale-105 tw-shadow-2xl hover:tw-shadow-accent-foreground tw-text-center">
        <div className="tw-text-3xl tw-font-bold">
          A New Version is Available!
        </div>
        <div className="tw-flex tw-justify-center tw-items-center tw-gap-2 tw-font-mono">
          <div className="">{version}</div>
          <ArrowRight className="tw-size-4" />
          <div className="tw-font-bold tw-text-lg tw-text-accent-foreground">
            {newVersion}
          </div>
        </div>
        <div className="tw-flex tw-items-center tw-gap-2 tw-justify-center">
          <div className="tw-flex tw-flex-col tw-gap-1 tw-justify-center tw-items-center">
            <div>Restart the browser to trigger the update.</div>
            <div className="tw-flex tw-gap-1 tw-items-center">
              Not working?{' '}
              <a
                className="tw-underline tw-flex tw-items-center tw-gap-1"
                href="https://chromewebstore.google.com/detail/complexity/ffppmilmeaekegkpckebkeahjgmhggpj"
                target="_blank"
              >
                Reinstall
                <ExternalLink className="tw-size-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
