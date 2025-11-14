import type * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 3;

type ToasterToast = Omit<ToastProps, "title" | "description"> & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  timeout?: number;
};

const _actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof _actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function addToRemoveQueue(toastId: string, timeout: number = 3000) {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeoutId = setTimeout(function () {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, timeout);

  toastTimeouts.set(toastId, timeoutId);
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(function (t) {
          return t.id === action.toast.id ? { ...t, ...action.toast } : t;
        }),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(
          toastId,
          state.toasts.find(function (t) {
            return t.id === toastId;
          })?.timeout,
        );
      } else {
        state.toasts.forEach(function (toast) {
          addToRemoveQueue(toast.id, toast.timeout);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map(function (t) {
          return t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t;
        }),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter(function (t) {
          return t.id !== action.toastId;
        }),
      };
  }
}

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach(function (listener) {
    listener(memoryState);
  });
}

export type Toast = Omit<ToasterToast, "id">;

export function toast({ ...props }: Toast) {
  const id = genId();

  function update(props: ToasterToast) {
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  }

  function dismiss() {
    dispatch({ type: "DISMISS_TOAST", toastId: id });
  }

  // Check if adding this toast would exceed the limit
  const currentToastCount = memoryState.toasts.length;
  if (currentToastCount >= TOAST_LIMIT) {
    // Dismiss the oldest toast first
    const oldestToast = memoryState.toasts[memoryState.toasts.length - 1];
    if (oldestToast) {
      dispatch({ type: "DISMISS_TOAST", toastId: oldestToast.id });
    }

    // Delay adding the new toast to allow the old one to start sliding out
    setTimeout(function () {
      dispatch({
        type: "ADD_TOAST",
        toast: {
          ...props,
          id,
          open: true,
          onOpenChange: function (open) {
            if (!open) dismiss();
          },
        },
      });
    }, 150); // Small delay to allow slide-out animation to start
  } else {
    dispatch({
      type: "ADD_TOAST",
      toast: {
        ...props,
        id,
        open: true,
        onOpenChange: function (open) {
          if (!open) dismiss();
        },
      },
    });
  }

  return {
    id: id,
    dismiss,
    update,
  };
}

export function useToast() {
  const [state, setState] = useState<State>(memoryState);

  const registerListener = useEffectEvent(() => {
    listeners.push(setState);
    return function () {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  });

  useEffect(() => {
    return registerListener();
  }, []);

  return {
    ...state,
    toast,
    dismiss: function (toastId?: string) {
      return dispatch({ type: "DISMISS_TOAST", toastId });
    },
  };
}
