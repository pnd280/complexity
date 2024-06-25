import { webpageMessenger } from '@/content-script/webpage/messenger';

import { mermaid } from './artifacts-imports';
import { sleep } from './utils';

let queue: { selector: string; resolve: () => void }[] | null = null;
let isProcessing = false;
let debounceTimer: NodeJS.Timeout | null = null;

const processQueue = async (): Promise<void> => {
  if (isProcessing || !queue || queue.length === 0) return;

  isProcessing = true;
  const currentQueue = queue;
  queue = [];

  try {
    const allSelectors = currentQueue.map((item) => item.selector).join(', ');

    await mermaid();

    let success = false;

    while (!success) {
      success = await webpageMessenger.sendMessage({
        event: 'runMermaid',
        payload: allSelectors,
        timeout: 10000,
      });

      await sleep(100);
    }

    currentQueue.forEach((item) => item.resolve());
  } catch (error) {
    console.error('Error rendering mermaid Artifact:', error);
    currentQueue.forEach((item) => item.resolve());
  } finally {
    isProcessing = false;
    if (queue && queue.length > 0) {
      scheduleProcessing();
    }
  }
};

const scheduleProcessing = (): void => {
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(processQueue, 100);
};

export const enqueue = (selector: string): Promise<void> => {
  return new Promise<void>((resolve) => {
    if (queue === null) {
      queue = [];
    }
    queue.push({ selector, resolve });
    scheduleProcessing();
  });
};

const mermaidUtils = {
  enqueue,
};

export default mermaidUtils;
