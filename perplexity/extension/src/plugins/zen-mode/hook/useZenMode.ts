import { useSyncExternalStore } from "react";

function getZenModeSnapshot(): boolean {
  return document.body.getAttribute("data-cplx-zen-mode") === "true";
}

function subscribeToZenMode(callback: () => void): () => void {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-cplx-zen-mode"
      ) {
        callback();
        break;
      }
    }
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-cplx-zen-mode"],
  });

  return () => {
    observer.disconnect();
  };
}

export default function useZenMode(): boolean {
  const isZenMode = useSyncExternalStore(
    subscribeToZenMode,
    getZenModeSnapshot,
    getZenModeSnapshot,
  );

  return isZenMode;
}
