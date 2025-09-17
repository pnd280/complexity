import { useLocalStorage } from "@uidotdev/usehooks";

export default function CometCompatibility() {
  const [hasBeenClicked, setHasBeenClicked] = useLocalStorage(
    "comet-compatibility-announcement-clicked",
    false,
  );

  if (hasBeenClicked) {
    return null;
  }

  const handleClick = () => {
    setHasBeenClicked(true);
    chrome.tabs.create({
      url: "https://github.com/pnd280/complexity/blob/nxt/perplexity/extension/docs/comet-enable-extensions.md",
      active: true,
    });
  };

  return (
    <div
      className="x:group x:relative x:flex x:w-full x:cursor-pointer x:flex-col x:items-start x:gap-2 x:rounded-xl x:border x:border-border/50 x:bg-secondary x:p-4 x:text-sm x:font-medium x:shadow-lg x:transition-all x:hover:scale-105 x:hover:border-primary x:hover:bg-primary/10"
      onClick={handleClick}
    >
      <span className="x:flex-1 x:text-left x:text-sm">
        On the Comet browser? Check out this tutorial to enable extensions.
      </span>

      <span
        className="x:cursor-pointer x:text-xs x:text-muted-foreground x:transition-all x:hover:text-primary"
        onClick={(e) => {
          e.stopPropagation();
          setHasBeenClicked(true);
        }}
      >
        Click to dismiss
      </span>
    </div>
  );
}
