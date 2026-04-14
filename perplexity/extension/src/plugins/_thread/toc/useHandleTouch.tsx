import { useViewport } from "@/hooks/useViewport";

export function useHandleTouch({
  containerRef,
  isOpen,
  setIsOpen,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { isMobile } = useViewport();

  useEffect(() => {
    if (!isMobile) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef, isMobile, isOpen, setIsOpen]);
}
