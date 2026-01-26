import {
  slashCommandMenuStore,
  useSlashCommandMenuStore,
} from "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/store";

export function useBlurHandler({
  contentRef,
  exceptionalElementSelectors = [],
}: {
  contentRef: React.RefObject<HTMLElement | null>;
  exceptionalElementSelectors?: string[];
}) {
  const open = useSlashCommandMenuStore((store) => store.states.open);

  const isPartOfExceptionalElements = useCallback(
    (target: Node | null) => {
      if (!target) return false;

      if (exceptionalElementSelectors.length === 0) return false;

      return exceptionalElementSelectors.some((selector) => {
        const $elements = $(selector);
        for (let i = 0; i < $elements.length; i++) {
          const element = $elements[i];
          if (element && element.contains(target)) return true;
        }
        return false;
      });
    },
    [exceptionalElementSelectors],
  );

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const eventTarget = event.target as Node;

      if (contentRef.current?.contains(eventTarget)) return;

      if (!isPartOfExceptionalElements(eventTarget)) {
        slashCommandMenuStore.getState().states.setOpen(false);
      }
    };

    const handleFocusOut = () => {
      setTimeout(() => {
        const activeElement = document.activeElement;

        const isWithinContent =
          activeElement &&
          contentRef.current &&
          contentRef.current.contains(activeElement);

        if (!isWithinContent && !isPartOfExceptionalElements(activeElement)) {
          slashCommandMenuStore.getState().states.setOpen(false);
        }
      }, 0);
    };

    const handleScroll = (event: Event) => {
      const eventTarget = event.target as Node;

      if (contentRef.current?.contains(eventTarget)) return;

      if (!isPartOfExceptionalElements(eventTarget)) {
        slashCommandMenuStore.getState().states.setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("focusout", handleFocusOut);
    document.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("focusout", handleFocusOut);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, contentRef, isPartOfExceptionalElements]);
}
