import { useToggle } from "@uidotdev/usehooks";


import { cn } from "@/utils/cn";

type ThreadTitleProps = {
  query: string;
  onClick: () => void;
  isOutOfViewport: boolean;
};

export default function ThreadTitle({
  query,
  onClick,
  isOutOfViewport,
}: ThreadTitleProps) {
  const [visible, toggleVis] = useToggle(isOutOfViewport);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (isOutOfViewport) {
      toggleVis(true);
    }
  }, [isOutOfViewport, toggleVis]);

  return (
    <div
      ref={ref}
      className={cn(
        "tw-max-w-[10rem] tw-cursor-pointer tw-select-none tw-truncate tw-font-sans tw-text-muted-foreground tw-transition-all tw-fade-in tw-fade-out tw-slide-in-from-bottom tw-slide-out-to-bottom tw-fill-mode-forwards active:tw-scale-95 2xl:tw-max-w-[20rem]",
        {
          "!tw-hidden": !visible,
          "tw-animate-in": isOutOfViewport,
          "tw-animate-out": !isOutOfViewport,
        },
      )}
      onClick={onClick}
      onAnimationEnd={() => {
        if (!isOutOfViewport) {
          toggleVis(false);
        }
      }}
    >
      <span>{query}</span>
    </div>
  );
}
