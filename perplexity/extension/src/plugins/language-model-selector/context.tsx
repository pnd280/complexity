import type { ReactNode } from "react";
import { createContext } from "react";

import type { LanguageModelCode } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import useHiddenModels from "@/plugins/language-model-selector/hooks/useHiddenModels";

type LanguageModelSelectorContextType = {
  type: "selector" | "rewrite";
  setHighlightedItem: (item: LanguageModelCode) => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
  hiddenModels: LanguageModelCode[];
  toggleModelVisibility: (modelCode: LanguageModelCode) => void;
};

export const LanguageModelSelectorContext =
  createContext<LanguageModelSelectorContextType | null>(null);

type LanguageModelSelectorProviderProps = Pick<
  LanguageModelSelectorContextType,
  "type" | "setHighlightedItem"
> & {
  children: ReactNode;
};

export function LanguageModelSelectorProvider({
  type,
  setHighlightedItem,
  children,
}: LanguageModelSelectorProviderProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [hiddenModels, setHiddenModels] = useHiddenModels();

  return (
    <LanguageModelSelectorContext
      value={{
        type,
        setHighlightedItem,
        isEditMode,
        toggleEditMode: () => setIsEditMode((prev) => !prev),
        hiddenModels: hiddenModels,
        toggleModelVisibility: (code) => {
          setHiddenModels((prev) =>
            prev.includes(code)
              ? prev.filter((c) => c !== code)
              : [...prev, code],
          );
        },
      }}
    >
      {children}
    </LanguageModelSelectorContext>
  );
}
