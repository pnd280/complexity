import { insertCss } from "@/utils/dom-utils/generics";

type CleanupFunction = () => void;

export function useInsertCss({
  css,
  id,
  inject = true,
}: {
  css: string;
  id: string;
  inject?: boolean;
}) {
  const cleanupRef = useRef<CleanupFunction>(null);

  useEffect(() => {
    if (!inject) {
      cleanupRef.current?.();
      return;
    }

    cleanupRef.current = insertCss({
      css,
      id,
    });
  }, [css, inject, id]);

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);
}
