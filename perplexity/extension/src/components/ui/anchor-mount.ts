// original author: https://github.com/molvqingtai/react-magic-portal

import React, { useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export interface MagicPortalProps {
  anchor: Element | null;
  position?: "last" | "first" | "before" | "after"; // if postion != "last", the children either be a direct DOM elements or accepts a ref
  softPositioning?: boolean; // ignore position after the first mount if the portal's content is moved by external factors
  children: React.ReactElement | null;
  onMount?: (anchor: Element, container: Element) => void;
  onUnmount?: (anchor: Element, container: Element) => void;
}

/**
 * https://github.com/radix-ui/primitives/blob/36d954d3c1b41c96b1d2e875b93fc9362c8c09e6/packages/react/slot/src/slot.tsx#L166
 */
const getElementRef = (element: React.ReactElement) => {
  // React <=18 in DEV
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return (element as any).ref as React.Ref<Element>;
  }
  // React 19 in DEV
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return (element.props as { ref?: React.Ref<Element> }).ref;
  }

  // Not DEV
  return (
    (element.props as { ref?: React.Ref<Element> }).ref ||
    ((element as any).ref as React.Ref<Element>)
  );
};

const resolveContainer = (
  anchor: Element | null,
  position: MagicPortalProps["position"],
): Element | null => {
  if (!anchor) {
    return null;
  }

  return position === "first" || position === "last"
    ? anchor
    : anchor.parentElement;
};

/**
 * https://github.com/facebook/react/blob/d91d28c8ba6fe7c96e651f82fc47c9d5481bf5f9/packages/react-reconciler/src/ReactFiberHooks.js#L2792
 */
const setRef = <T>(ref: React.Ref<T> | undefined, value: T) => {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== undefined) {
    ref.current = value;
  }
};

const mergeRef = <T extends Element | null>(
  ...refs: (React.Ref<T> | undefined)[]
) => {
  return (node: T) => {
    const cleanups = refs.map((ref) => setRef(ref, node));
    return () =>
      cleanups.forEach((cleanup, index) =>
        typeof cleanup === "function" ? cleanup() : setRef(refs[index], null),
      );
  };
};

const insertAdjacentElementPositionMap = {
  before: "beforebegin",
  first: "afterbegin",
  last: "beforeend",
  after: "afterend",
} as const;

const AnchorMount = ({
  anchor,
  position = "last",
  softPositioning = false,
  children,
  onMount,
  onUnmount,
}: MagicPortalProps) => {
  const anchorRef = useRef<Element | null>(null);
  const [container, setContainer] = useState<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  const insertNode = useCallback(
    (node: Element | null) => {
      if (!node) {
        return;
      }

      if (softPositioning && mounted) {
        return;
      }

      const anchorElement = anchorRef.current;
      if (!anchorElement) {
        return;
      }

      const containerElement = resolveContainer(anchorElement, position);
      if (!containerElement) {
        return;
      }

      let alreadyPlaced = false;

      switch (position) {
        case "last":
          alreadyPlaced =
            node.parentElement === containerElement &&
            containerElement.lastChild === node;
          break;
        case "first":
          alreadyPlaced =
            node.parentElement === containerElement &&
            containerElement.firstChild === node;
          break;
        case "before":
          alreadyPlaced =
            node.parentElement === containerElement &&
            anchorElement.previousSibling === node;
          break;
        case "after":
          alreadyPlaced =
            node.parentElement === containerElement &&
            anchorElement.nextSibling === node;
          break;
      }

      if (!alreadyPlaced) {
        console.log(node);
        anchorElement.insertAdjacentElement(
          insertAdjacentElementPositionMap[position],
          node,
        );
      }
    },
    [mounted, position, softPositioning],
  );

  const child = useMemo(() => {
    if (React.Children.count(children) > 1) {
      console.error(
        "[react-magic-portal] Multiple children are not supported, expected to receive a single React element child.",
      );
      return null;
    }

    if (!React.isValidElement(children)) {
      return null;
    }

    if (children.type === React.Fragment) {
      console.error(
        "[react-magic-portal] Fragment children are not supported, expected to receive a single React element child.",
      );
      return null;
    }

    const originalRef = getElementRef(children);

    return React.cloneElement(children as React.ReactElement<any>, {
      // eslint-disable-next-line react-hooks/refs
      ref: mergeRef(originalRef, insertNode),
    });
  }, [children, insertNode]);

  useLayoutEffect(() => {
    anchorRef.current = anchor;
    const nextContainer = resolveContainer(anchorRef.current, position);
    /**
     * React 19 in DEV
     * Suppress DevTools warning from React runtime about conflicting container children.
     * @see https://github.com/facebook/react/blob/main/packages/react-dom-bindings/src/client/ReactFiberConfigDOM.js#L973
     */
    if (nextContainer) {
      (
        nextContainer as { __reactWarnedAboutChildrenConflict?: boolean }
      ).__reactWarnedAboutChildrenConflict = true;
    }

    setContainer(nextContainer);
  }, [anchor, position]);

  useEffect(() => {
    if (container && anchorRef.current) {
      onMount?.(anchorRef.current, container);
      setMounted(true);
      return () => {
        onUnmount?.(anchorRef.current!, container);
        setMounted(false);
      };
    }
  }, [onMount, onUnmount, container]);

  return container && child ? createPortal(child, container) : null;
};

AnchorMount.displayName = "AnchorMount";

export default AnchorMount;
