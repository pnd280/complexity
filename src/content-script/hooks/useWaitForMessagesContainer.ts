import useWaitForElement from "@/content-script/hooks/useWaitForElement";
import UiUtils from "@/utils/UiUtils";

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
    selector: () => UiUtils.getMessagesContainer()[0],
    timeout,
  });

  return {
    isWaiting,
    messagesContainer: element,
  };
}
