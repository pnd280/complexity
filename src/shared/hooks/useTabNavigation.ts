import { useCallback, useRef } from "react";

export default function useTabNavigation(fieldNames: string[]) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleTabNavigation = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const currentIndex = fieldNames.indexOf(e.currentTarget.id);
        const nextIndex = (currentIndex + 1) % fieldNames.length;
        const nextField = formRef.current?.querySelector(
          `#${fieldNames[nextIndex]}`,
        ) as HTMLElement;
        nextField?.focus();
      }
    },
    [fieldNames],
  );

  return { formRef, handleTabNavigation };
}
