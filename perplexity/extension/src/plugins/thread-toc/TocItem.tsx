import type { TocItem as TocItemType } from "@/plugins/thread-toc/store/types";

export default function TocItem({
  item,
  onClick,
  onContextMenu,
}: {
  item: TocItemType;
  onClick: () => void;
  onContextMenu: () => void;
}) {
  const title =
    item.title.trim().slice(0, 300) + (item.title.length > 300 ? "..." : "");

  return (
    <div
      className="x:flex x:cursor-pointer x:gap-4"
      title={title}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu();
      }}
    >
      <div
        className={cn("x:min-h-5 x:min-w-[2px] x:rounded-full", {
          "x:bg-foreground": item.isActive,
          "x:bg-muted-foreground": !item.isActive,
        })}
      />
      <div
        className={cn("x:line-clamp-2 x:text-sm x:transition-colors", {
          "x:font-medium x:text-foreground": item.isActive,
          "x:text-muted-foreground x:hover:text-foreground": !item.isActive,
        })}
      >
        {title}
      </div>
    </div>
  );
}
