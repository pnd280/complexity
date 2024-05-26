import $ from 'jquery';

export type OnElementExistOptions = {
  selector: string | (() => Element[]);
  callback: (args: { element: Element; reobserve: () => void }) => void;
  recurring?: boolean;
  observedIdentifier?: string;
};

export const onElementExist = ({
  selector,
  callback,
  recurring = true,
  observedIdentifier = 'observed',
}: OnElementExistOptions): MutationObserver => {
  requestIdleCallback(() => {
    checkAndInvokeCallback();
  });

  const observer = new MutationObserver(() => {
    checkAndInvokeCallback();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });

  function checkAndInvokeCallback() {
    let elements;

    if (typeof selector === 'string') {
      elements = $(selector).toArray();
    } else if (typeof selector === 'function') {
      elements = selector();
    }

    elements?.forEach((element) => {
      if (!document.contains(element)) return;

      if ($(element).data(observedIdentifier) !== true) {
        callback({
          element,
          reobserve: () => $(element).data(observedIdentifier, false),
        });

        $(element).data(observedIdentifier, true);
        $(element).attr(`data-${observedIdentifier}`, 'true');
      }
    });

    if (!recurring) {
      observer.disconnect();
    }
  }

  return observer;
};

export function onAttributeChanges({
  targetNode,
  attributes,
  immediateInvoke = false,
  callback,
}: {
  targetNode: HTMLElement;
  attributes: string[];
  immediateInvoke?: boolean;
  callback: ({
    mutation,
    targetNode,
  }: {
    targetNode: Element;
    mutation: MutationRecord;
  }) => void;
}): MutationObserver {
  // TODO: disconnect observer when no longer needed

  if (immediateInvoke)
    callback({ targetNode, mutation: { attributeName: '' } as MutationRecord });

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        attributes.includes(mutation.attributeName!)
      ) {
        callback({ targetNode, mutation });
      }
    });
  });

  observer.observe(targetNode, {
    attributes: true,
    attributeFilter: attributes,
  });

  return observer;
}
