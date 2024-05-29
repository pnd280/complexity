import $ from 'jquery';

export type OnElementExistOptions<T extends any> = {
  selector:
    | string
    | (() => Element[])
    | (() => {
        element: Element;
        args: T;
      }[]);
  callback: (args: {
    element: Element;
    args?: T;
    reobserve: () => void;
  }) => void;
  recurring?: boolean;
  observedIdentifier?: string;
};

function onElementExist<T>({
  selector,
  callback,
  recurring = true,
  observedIdentifier = 'observed',
}: OnElementExistOptions<T>): MutationObserver {
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

    if (isStringSelector(selector)) {
      elements = $(selector).toArray();
    } else if (isElementArraySelector(selector)) {
      elements = selector();
    } else if (isElementWithArgsArraySelector(selector)) {
      elements = selector().map((item) => item.element);
    }

    elements?.forEach((element) => {
      if (!document.contains(element)) return;

      if ($(element).data(observedIdentifier) !== true) {
        callback({
          element,
          args: isElementWithArgsArraySelector(selector)
            ? selector().find((item) => item.element === element)?.args
            : undefined,
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

  function isStringSelector(selector: any): selector is string {
    return typeof selector === 'string';
  }

  function isElementArraySelector(selector: any): selector is () => Element[] {
    return (
      typeof selector === 'function' &&
      Array.isArray(selector()) &&
      selector().every((el: any) => el instanceof Element)
    );
  }

  function isElementWithArgsArraySelector(
    selector: any
  ): selector is () => { element: Element; args: T }[] {
    return (
      typeof selector === 'function' &&
      Array.isArray(selector()) &&
      selector().every((item: any) => item?.element instanceof Element)
    );
  }
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
