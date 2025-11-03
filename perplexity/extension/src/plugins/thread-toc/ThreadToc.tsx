import { useInsertCss } from "@/hooks/useInsertCss";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-client";
import { useThreadDomObserverStore } from "@/plugins/__core__/dom-observers/thread/store";
import { threadTocCssResourceConfig } from "@/plugins/thread-toc/index.remote-resources";
import { TocMenuToggle } from "@/plugins/thread-toc/TocMenuToggle";
import { TocPanel } from "@/plugins/thread-toc/TocPanel";
import { useHandleTouch } from "@/plugins/thread-toc/useHandleTouch";
import { usePanelPosition } from "@/plugins/thread-toc/usePanelPosition";
import { useThreadTocItems } from "@/plugins/thread-toc/useThreadTocItems";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

const threadTocCss = await getVersionedRemoteResource(
  threadTocCssResourceConfig,
  persistentQueryClient,
);

export function ThreadToc() {
  const [isOpen, setIsOpen] = useState(false);

  const threadWrapper = useThreadDomObserverStore(
    (store) => store.$wrapper?.[0],
    deepEqual,
  );

  const containerRef = useRef<HTMLDivElement | null>(null);

  const tocItems = useThreadTocItems();

  const panelPosition = usePanelPosition({
    tocItems,
  });

  useInsertCss({
    id: "thread-toc",
    css: threadTocCss,
  });

  useHandleTouch({
    containerRef,
    isOpen,
    setIsOpen,
  });

  const shouldShowToc = tocItems.length > 1 && panelPosition != null;

  if (!shouldShowToc || threadWrapper == null) return null;

  return (
    <>
      <TocMenuToggle
        isOpen={isOpen}
        isFloating={panelPosition.isOverflowing}
        onToggleOpen={() => setIsOpen(true)}
      />
      <TocPanel
        containerRef={containerRef}
        left={panelPosition.position.left}
        isOpen={isOpen}
        isFloating={panelPosition.isOverflowing}
        tocItems={tocItems}
        onToggleClosed={() => setIsOpen(false)}
      />
    </>
  );
}
