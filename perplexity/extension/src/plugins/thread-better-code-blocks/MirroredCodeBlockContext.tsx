import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";

type MirroredCodeBlockContext = ReturnType<typeof createStore>;

type MirroredCodeBlockStore = {
  sourceMessageBlockIndex: number;
  sourceCodeBlockIndex: number;
  isWrapped: boolean;
  setIsWrapped: (isWrapped: boolean) => void;
  maxWidth: number;
  setMaxWidth: (maxWidth: number) => void;
  maxHeight: number;
  setMaxHeight: (maxHeight: number) => void;
  isHorizontalOverflowing: boolean;
  setIsHorizontalOverflowing: (isHorizontalOverflowing: boolean) => void;
  isVerticalOverflowing: boolean;
  setIsVerticalOverflowing: (isVerticalOverflowing: boolean) => void;
};

type InitialState = Omit<
  MirroredCodeBlockStore,
  | "setIsWrapped"
  | "setMaxWidth"
  | "setMaxHeight"
  | "setIsHorizontalOverflowing"
  | "setIsVerticalOverflowing"
>;

export const createStore = (initialState: InitialState) =>
  createWithEqualityFn<MirroredCodeBlockStore>()(
    subscribeWithSelector(
      immer(
        (set): MirroredCodeBlockStore => ({
          ...initialState,
          setIsWrapped: (isWrapped) => {
            set((state) => {
              state.isWrapped = isWrapped;
            });
          },
          setMaxWidth: (maxWidth) => {
            set((state) => {
              state.maxWidth = maxWidth;
            });
          },
          setMaxHeight: (maxHeight) => {
            set((state) => {
              state.maxHeight = maxHeight;
            });
          },
          setIsHorizontalOverflowing: (isHorizontalOverflowing) => {
            set((state) => {
              state.isHorizontalOverflowing = isHorizontalOverflowing;
            });
          },
          setIsVerticalOverflowing: (isVerticalOverflowing) => {
            set((state) => {
              state.isVerticalOverflowing = isVerticalOverflowing;
            });
          },
        }),
      ),
    ),
  );

const MirroredCodeBlockContext = createContext<MirroredCodeBlockContext | null>(
  null,
);

export const MirroredCodeBlockContextProvider = memo(
  function MirroredCodeBlockContextProvider({
    storeValue,
    children,
  }: {
    storeValue: InitialState;
    children: React.ReactNode;
  }) {
    const [store] = useState(() => createStore(storeValue));

    return (
      <MirroredCodeBlockContext value={store}>
        {children}
      </MirroredCodeBlockContext>
    );
  },
);

export function useMirroredCodeBlockContext() {
  const context = use(MirroredCodeBlockContext);
  if (!context) {
    throw new Error(
      "useMirroredCodeBlockContext must be used within a MirroredCodeBlockContext",
    );
  }

  const contextValues = context();

  return {
    codeBlock: useThreadCodeBlock({
      messageBlockIndex: contextValues.sourceMessageBlockIndex,
      codeBlockIndex: contextValues.sourceCodeBlockIndex,
    }),
    ...contextValues,
  };
}
