import { useEffect } from 'react';

import $ from 'jquery';

import { useToast } from '@/components/ui/use-toast';
import DOMObserver from '@/utils/dom-observer';

export function IncompatibleInterfaceLanguageNotice() {
  const { toast } = useToast();

  useEffect(() => {
    DOMObserver.create('interface-language-select', {
      target: document.querySelector('body > div'),
      debounceTime: 1000,
      config: { childList: true, subtree: true },
      onAny() {
        const $select = $('#interface-language-select');
        if ($select.length) {
          if ($select.val() !== 'en-US') {
            toast({
              variant: 'destructive',
              title: '⚠️ Unsupported Language',
              description: (
                <span>
                  The extension is only available in{' '}
                  <span className="tw-font-bold">English.</span>
                </span>
              ),
            });
          }

          DOMObserver.destroy('interface-language-select');
        }
      },
    });

    return () => {
      DOMObserver.destroy('interface-language-select');
    };
  }, [toast]);

  return null;
}
