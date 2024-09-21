import { debounce } from "lodash";
import {
  useCallback,

  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Updater, useImmer } from "use-immer";

import Toolbar from "@/content-script/components/ThreadMessageStickyToolbar/Toolbar";
import useThreadMessageStickyToolbarObserver from "@/content-script/hooks/useThreadMessageStickyToolbarObserver";
import Portal from "@/shared/components/Portal";
import { DomSelectors } from "@/utils/DomSelectors";
import UiUtils from "@/utils/UiUtils";
import { onScrollDirectionChange } from "@/utils/utils";

export type Container = {
  messageBlock: Element;
  query: Element;
  container: Element;
  answer: Element;
};

export type ContainerStates = {
  isMarkdown: boolean;
  isQueryOutOfViewport: boolean;
  isHidden: boolean;
};

export type ToggleToolbarVisibilityProps = {
  bottomButtonBar: Element;
  index: number;
  messageBlock: Element;
};

const prevIsIncognito = !!$(DomSelectors.QUERY_BOX.FORK_BUTTON).length;

const isChanged = (prev: Container[], next: Container[]): boolean => {
  const isIncognito = !!$(DomSelectors.QUERY_BOX.FORK_BUTTON).length;

  if (prevIsIncognito !== isIncognito) return true;

  if (prev.length !== next.length) return true;
  for (let i = prev.length - 1; i >= 0; i--) {
    if (
      prev[i].messageBlock !== next[i].messageBlock ||
      prev[i].query !== next[i].query ||
      prev[i].container !== next[i].container ||
      prev[i].answer !== next[i].answer
    ) {
      return true;
    }
  }
  return false;
};

export default function ThreadMessageStickyToolbar() {
  const [containers, setContainers] = useState<Container[]>([]);
  const deferredContainers = useDeferredValue(containers);
  const [containersStates, setContainersStates] = useImmer<ContainerStates[]>(
    [],
  );

  const containersRef = useRef<Container[]>([]);

  const updateContainers = useCallback(
    (newContainers: Container[]) => {
      if (isChanged(containersRef.current, newContainers)) {
        containersRef.current = newContainers;
        setContainers(newContainers);

        setContainersStates((draft) => {
          draft.splice(newContainers.length);

          newContainers.forEach((_, index) => {
            if (draft[index] == null) {
              draft[index] = {
                isMarkdown: true,
                isQueryOutOfViewport: false,
                isHidden: true,
              };
            }
          });
        });
      }
    },
    [setContainers, setContainersStates],
  );

  const toggleVisibility = useCallback(
    ({
      bottomButtonBar,
      index,
      messageBlock,
    }: ToggleToolbarVisibilityProps) => {
      const hide = !messageBlock.contains(bottomButtonBar);

      if (hide && containersStates[index]?.isHidden === hide) return;

      setContainersStates((draft) => {
        if (draft[index] != null) draft[index].isHidden = hide;
      });
    },
    [containersStates, setContainersStates],
  );

  useThreadMessageStickyToolbarObserver({ toggleVisibility, updateContainers });

  useScrollDirection(deferredContainers, setContainersStates);

  const renderToolbar = useCallback(
    (container: Container, index: number) => {
      if (containers[index] == null) return null;

      return (
        <Portal key={index} container={container.container as HTMLElement}>
          <Toolbar
            containers={containers}
            containersStates={containersStates}
            containerIndex={index}
            setContainersStates={setContainersStates}
          />
        </Portal>
      );
    },
    [containers, containersStates, setContainersStates],
  );

  return deferredContainers.map(renderToolbar);
}

const useScrollDirection = (
  containers: Container[],
  setContainersStates: Updater<ContainerStates[]>,
) => {
  const stickyNavHeight = useMemo(
    () => UiUtils.getStickyNavbar()?.outerHeight() ?? 3 * 16,
    [],
  );

  const handleScrollDirectionChange = useCallback(() => {
    setContainersStates((draft) => {
      draft.forEach((_, index) => {
        if (containers[index]?.query != null) {
          draft[index].isQueryOutOfViewport =
            containers[index]?.query.getBoundingClientRect().top +
              containers[index]?.query.getBoundingClientRect().height <
            -20;
        }
      });
    });
  }, [containers, setContainersStates]);

  useEffect(() => {
    const debouncedHandleScrollDirectionChange = debounce(
      handleScrollDirectionChange,
      100,
    );

    const stopObserving = onScrollDirectionChange({
      up: () => debouncedHandleScrollDirectionChange(),
      down: () => debouncedHandleScrollDirectionChange(),
      identifier: "threadMessageStickyToolbar",
    });

    requestIdleCallback(() => debouncedHandleScrollDirectionChange());

    return () => {
      stopObserving();
    };
  }, [
    containers,
    stickyNavHeight,
    setContainersStates,
    handleScrollDirectionChange,
  ]);
};
