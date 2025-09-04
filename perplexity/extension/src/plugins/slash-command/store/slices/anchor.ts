import type { UsePopoverProps } from "@ark-ui/react";

import type { BoundStateCreator } from "@/plugins/slash-command/store/types";
import type { getSelection, getWordAtCaret } from "@/utils/textarea-utils";

export type AnchorSlice = {
  anchor: {
    element: HTMLElement | null;
    positioningOptions: UsePopoverProps["positioning"] | null;
    inputField: HTMLElement | null;
    contentActions: {
      getWordAtCaret: () => ReturnType<typeof getWordAtCaret>;
      insertText: (text: string) => void;
      deleteTriggerPhrase: () => void;
      setSelection: (
        selection: {
          start: number;
          end: number;
        } | null,
      ) => void;
      scrollIntoCaretView: () => void;
      getSelection: () => {
        start: number;
        end: number;
        value: string;
      } | null;
    } | null;
    actions: {
      setElement: (element: HTMLElement | null) => void;
      setPositioningOptions: (
        positioningOptions: UsePopoverProps["positioning"] | null,
      ) => void;
      setInputField: (inputField: HTMLElement | null) => void;
      setContentActions: (
        contentActions: {
          setSelection: (
            selection: {
              start: number;
              end: number;
            } | null,
          ) => void;
          getWordAtCaret: () => ReturnType<typeof getWordAtCaret>;
          insertText: (text: string) => void;
          deleteTriggerPhrase: () => void;
          scrollIntoCaretView: () => void;
          getSelection: () => {
            start: number;
            end: number;
            value: string;
          } | null;
        } | null,
      ) => void;
    };
  };
  bufferText: string | null;
  bufferTextCaretPosition: number | null;
  bufferRichText: string | null;
  setBufferText: (bufferText: string | null) => void;
  setBufferRichText: (bufferRichText: string | null) => void;
  setBufferTextCaretPosition: (bufferTextCaretPosition: number | null) => void;
  restoreText: () => void;
};

export const createAnchorSlice: BoundStateCreator<AnchorSlice> = (
  set,
  get,
) => ({
  anchor: {
    element: null,
    positioningOptions: null,
    inputField: null,
    caretPosition: null,
    contentActions: null,

    actions: {
      setElement: (element) =>
        set({
          anchor: {
            ...get().anchor,
            element,
          },
        }),
      setPositioningOptions: (positioningOptions) =>
        set({
          anchor: {
            ...get().anchor,
            positioningOptions,
          },
        }),
      setInputField: (inputField) =>
        set({
          anchor: {
            ...get().anchor,
            inputField,
          },
        }),
      setContentActions: (contentActions) =>
        set({
          anchor: {
            ...get().anchor,
            contentActions,
          },
        }),
    },
  },
  bufferText: null,
  bufferTextCaretPosition: null,
  bufferRichText: null,
  setBufferRichText: (bufferRichText) => {
    set({ bufferRichText });
  },
  setBufferText: (bufferText) => {
    set({ bufferText });
  },
  setBufferTextCaretPosition: (bufferTextCaretPosition) => {
    set({ bufferTextCaretPosition });
  },
  restoreText: () => {
    const {
      bufferText,
      bufferTextCaretPosition,
      anchor: { inputField, contentActions },
    } = get();

    if (
      bufferText === null ||
      bufferText.length <= 0 ||
      bufferTextCaretPosition === null ||
      !inputField ||
      !contentActions
    )
      return;

    contentActions.setSelection({
      start: bufferTextCaretPosition,
      end: bufferTextCaretPosition,
    });

    contentActions.insertText(bufferText);

    set({ bufferText: null });
  },
});
