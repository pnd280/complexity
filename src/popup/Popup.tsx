import { useEffect } from 'react';

import $ from 'jquery';

export const Popup = () => {
  useEffect(() => {
    $('html').toggleClass(
      'dark',
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  }, []);

  return (
    <main className="tw-h-[500px] tw-w-[500px] tw-bg-background tw-text-foreground tw-flex tw-flex-col tw-gap-4 tw-justify-center tw-items-center">
      
    </main>
  );
};

export default Popup;
