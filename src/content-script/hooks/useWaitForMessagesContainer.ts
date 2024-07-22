import UIUtils from "@/utils/UI";

import useWaitForElement from "./useWaitForElement";

export default function useWaitForMessagesContainer(
  {
    timeout,
  }: {
    timeout: number;
  } = {
    timeout: 5000,
  },
) {
  const { element, isWaiting } = useWaitForElement({
    id: "messagesContainer",
    selector: () => UIUtils.getMessagesContainer()[0],
    timeout,
  });

  return {
    isWaiting,
    messagesContainer: element,
  };
}
