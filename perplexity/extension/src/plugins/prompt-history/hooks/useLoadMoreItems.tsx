import { useIntersectionObserver } from "@uidotdev/usehooks";

type UseIntersectionObserverProps = {
  hasNextPage: boolean;
  isFetching: boolean;
  fetchNextPage: () => void;
};

export default function useLoadMoreItems({
  hasNextPage,
  isFetching,
  fetchNextPage,
}: UseIntersectionObserverProps): {
  triggerRef: (node: Element | null) => void;
} {
  const [triggerRef, entry] = useIntersectionObserver({
    root: $("[cmdk-list]")[0],
    threshold: 0,
    rootMargin: "0px 0px 5px 0px",
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [entry, hasNextPage, isFetching, fetchNextPage]);

  return { triggerRef };
}
