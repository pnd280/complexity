import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Check,
  ExternalLink,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { chromeStorage } from '@/utils/chrome-store';
import { jsonUtils } from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';

export default function CustomCSS() {
  const { data: savedCode, isLoading } = useQuery({
    queryKey: ['customCSS'],
    queryFn: () => chromeStorage.getStorageValue('customCSS'),
  });

  const [saveButtonText, setSaveButtonText] = useState<React.ReactNode>('Save');

  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading) {
      ref.current!.value = jsonUtils.safeParse(savedCode || '');
    }
  }, [savedCode, isLoading]);

  return (
    <div className="tw-flex tw-flex-col tw-space-y-4">
      <a
        href="#"
        className="tw-ml-auto tw-flex tw-items-center tw-gap-1 tw-text-[1rem] hover:tw-underline"
      >
        Reference <ExternalLink className="tw-w-4 tw-h-4" />{' '}
      </a>
      <Textarea
        ref={ref}
        className="tw-font-mono tw-h-[500px] tw-resize-none"
        placeholder="Put your CSS code here..."
      />
      <Button
        onClick={async () => {
          await chromeStorage.setStorageValue({
            key: 'customCSS',
            value: JSON.stringify(ref.current!.value),
          });

          setSaveButtonText(<Check className="tw-h-4 tw-w-4 tw-mr-2" />);

          setTimeout(() => {
            setSaveButtonText('Save');
          }, 2000);
        }}
      >
        {saveButtonText}
      </Button>
    </div>
  );
}
