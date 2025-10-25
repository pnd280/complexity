import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import useThreadCodeBlock from "@/plugins/__core__/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";

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
    // eslint-disable-next-line react-hooks/refs
    const store = useRef(createStore(storeValue)).current;

    return (
      <MirroredCodeBlockContext value={store}>
        {children}
      </MirroredCodeBlockContext>
    );
  },
);

export function useMirroredCodeBlockContext() {
  const store = use(MirroredCodeBlockContext)?.();

  invariant(
    store != null,
    "useMirroredCodeBlockContext must be used within a MirroredCodeBlockContext",
  );

  const codeBlock = useThreadCodeBlock({
    messageBlockIndex: store.sourceMessageBlockIndex,
    codeBlockIndex: store.sourceCodeBlockIndex,
  });

  return {
    codeBlock,
    ...store,
  };
}
