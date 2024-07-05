import { ui } from '@/utils/ui';

import useWaitForElement from './useWaitForElement';

export default function useWaitForMessagesContainer(
  {
    timeout,
  }: {
    timeout: number;
  } = {
    timeout: 5000,
  }
) {
  const { element, isWaiting } = useWaitForElement({
    id: 'messagesContainer',
    selector: () => ui.getMessagesContainer()[0],
    timeout,
  });

  return {
    isWaiting,
    messagesContainer: element,
  };
}
