import LuConstruction from "~icons/lucide/construction";

export function PluginLockDownOverlay({
  text,
  subText,
}: {
  text?: string;
  subText?: string;
}) {
  return (
    <div className="x:absolute x:inset-0 x:isolate x:flex x:flex-col x:items-center x:justify-center x:gap-4 x:overflow-hidden x:rounded-xl">
      <div className="x:absolute x:inset-0 x:size-full x:rounded-xl x:border x:border-yellow-300/20 x:bg-secondary/80" />
      <LuConstruction className="x:z-10 x:size-10 x:text-yellow-300" />
      <div className="x:z-10 x:mx-4 x:text-center x:text-pretty x:text-foreground">
        <div>{text ?? "This plugin is not available at the moment"}</div>
        <div>{subText ?? "Please check back later"}</div>
      </div>
    </div>
  );
}
