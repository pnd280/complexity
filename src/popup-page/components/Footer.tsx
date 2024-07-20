import $ from 'jquery';

import { Zap } from 'lucide-react';
import { useEffect } from 'react';

import Tooltip from '@/shared/components/Tooltip';
import ChromeStorage from '@/utils/ChromeStorage';
import { cn } from '@/utils/shadcn-ui-utils';
import { detectConsecutiveClicks } from '@/utils/utils';
import { Separator } from '@radix-ui/react-separator';

import packageData from '../../../package.json';

const version = `beta-${packageData.version}`;

export default function Footer() {
  useEffect(() => {
    detectConsecutiveClicks({
      element: $('#complexity-version')[0],
      requiredClicks: 7,
      clickInterval: 2000,
      callback() {
        ChromeStorage.setStorageValue({
          key: 'secretMode',
          value: true,
        });
        $('#complexity-version').text('🔓');
      },
    });
  }, []);

  return (
    <div className="tw-w-full tw-bg-secondary tw-flex tw-flex-col tw-font-sans">
      <Separator />
      <div className="tw-flex tw-px-2">
        <div className="tw-py-2 tw-text-sm tw-font-bold tw-flex tw-items-center">
          <span>Complexity</span>
          <Zap className="tw-h-3 tw-w-3 tw-mx-1 tw-text-accent-foreground" />
          <Tooltip content="Discord: feline9655">
            <div className="tw-text-secondary-foreground !tw-min-w-max tw-truncate">
              by <span className="tw-underline">pnd280</span>
            </div>
          </Tooltip>
        </div>
        <div
          id="complexity-version"
          title={version}
          className={cn(
            'tw-px-2 tw-py-1 tw-text-[.6rem] tw-font-bold tw-ml-auto tw-bg-background tw-text-foreground tw-rounded-md tw-font-mono tw-text-xs tw-self-center tw-border tw-truncate'
          )}
        >
          {version}
        </div>
      </div>
    </div>
  );
}
