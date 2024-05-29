import $ from 'jquery';

export type OnElementExistOptions = {
  selector: string | (() => Element[]);
  callback: (args: { element: Element; reobserve: () => void }) => void;
  recurring?: boolean;
  observedIdentifier?: string;
};

function onElementExist({
  selector,
  callback,
  recurring = true,
  observedIdentifier = 'observed',
}: OnElementExistOptions): MutationObserver {
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
}

function onAttributeChanges({
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

function onDOMChanges({
  targetNode,
  callback,
  recurring = false,
}: {
  targetNode: Node | null;
  callback: (mutation: MutationRecord) => void;
  recurring?: boolean;
}): void {
  if (!targetNode || typeof callback !== 'function') return;

  const observerConfig: MutationObserverInit = {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  };

  let observer: MutationObserver;

  const startObserving = () => {
    observer = new MutationObserver((mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        callback(mutation);
      }
      if (recurring && !document.body.contains(targetNode)) {
        observer.disconnect();
        const checkExistence = setInterval(() => {
          if (document.body.contains(targetNode)) {
            clearInterval(checkExistence);
            startObserving();
          }
        }, 1000);
      }
    });
    observer.observe(targetNode, observerConfig);
  };

  const checkNodeExistence = () => {
    if (document.body.contains(targetNode)) {
      startObserving();
    } else if (recurring) {
      const checkExistence = setInterval(() => {
        if (document.body.contains(targetNode)) {
          clearInterval(checkExistence);
          startObserving();
        }
      }, 1000);
    }
  };

  checkNodeExistence();
}

function onShallowRouteChange(callback: () => void) {
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;

      callback();
    }
  }).observe(document, { subtree: true, childList: true });
}

const observer = {
  onElementExist,
  onAttributeChanges,
  onShallowRouteChange,
  onDOMChanges,
};

export default observer;
