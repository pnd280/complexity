import { useDebounce } from "@uidotdev/usehooks";
import { debounce } from "lodash-es";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactDom from "react-dom";
import { Updater, useImmer } from "use-immer";

import useThreadMessageStickyToolbarObserver from "@/content-script/hooks/useThreadMessageStickyToolbarObserver";
import UiUtils from "@/utils/UiUtils";
import { onScrollDirectionChange } from "@/utils/utils";

import ThreadMessageStickyToolbarComponents from "./ThreadMessageStickyToolbarComponents";

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

const compare = (prev: Container[], next: Container[]): boolean => {
  if (prev.length !== next.length) return false;
  for (let i = prev.length - 1; i >= 0; i--) {
    if (
      prev[i].messageBlock !== next[i].messageBlock ||
      prev[i].query !== next[i].query ||
      prev[i].container !== next[i].container ||
      prev[i].answer !== next[i].answer
    ) {
      return false;
    }
  }
  return true;
};

export default function ThreadMessageStickyToolbar() {
  const [containers, setContainers] = useState<Container[]>([]);
  const debouncedContainers = useDebounce(containers, 200);
  const [containersStates, setContainersStates] = useImmer<ContainerStates[]>(
    [],
  );

  const containersRef = useRef<Container[]>([]);

  const updateContainers = useCallback(
    (newContainers: Container[]) => {
      if (!compare(containersRef.current, newContainers)) {
        containersRef.current = newContainers;
        setContainers(newContainers);

        setContainersStates((draft) => {
          draft.splice(newContainers.length);

          newContainers.forEach((_, index) => {
            if (!draft[index]) {
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
        if (draft[index]) draft[index].isHidden = hide;
      });
    },
    [containersStates, setContainersStates],
  );

  useThreadMessageStickyToolbarObserver({ toggleVisibility, updateContainers });

  useScrollDirection(debouncedContainers, setContainersStates);

  const renderToolbar = useCallback(
    (container: Container, index: number) => (
      <Fragment key={index}>
        {containers[index] &&
          ReactDom.createPortal(
            <ThreadMessageStickyToolbarComponents
              containers={containers}
              containersStates={containersStates}
              containerIndex={index}
              setContainersStates={setContainersStates}
            />,
            container.container,
          )}
      </Fragment>
    ),
    [containers, containersStates, setContainersStates],
  );

  return debouncedContainers.map(renderToolbar);
}

const useScrollDirection = (
  containers: Container[],
  setContainersStates: Updater<ContainerStates[]>,
) => {
  const stickyNavHeight = useMemo(
    () => UiUtils.getStickyNavbar()?.outerHeight() || 3 * 16,
    [],
  );

  const handleScrollDirectionChange = useCallback(() => {
    setContainersStates((draft) => {
      draft.forEach((_, index) => {
        if (containers[index]?.query) {
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
