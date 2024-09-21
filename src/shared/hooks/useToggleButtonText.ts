import { ReactNode } from "react";

type UseToggleButtonTextProps = {
  defaultText: ReactNode;
};

export default function useToggleButtonText({
  defaultText,
}: UseToggleButtonTextProps) {
  const _default = useMemo<ReactNode>(() => defaultText, [defaultText]);

  const [text, setText] = useState(_default);
  const timeoutRef = useRef<number | null>(null);

  const setNewText = (newText: ReactNode, timeout: number = 2000) => {
    setText(newText);
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
    }
    if (timeout) {
      timeoutRef.current = window.setTimeout(() => {
        setText(_default);
      }, timeout);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [text, setNewText] as const;
}
