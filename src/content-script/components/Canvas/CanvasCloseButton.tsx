import { LuX as X } from "react-icons/lu";

import { useCanvasStore } from "@/content-script/session-store/canvas";

export default function CloseButton() {
  const { toggleOpen, setMetaData } = useCanvasStore();

  return (
    <div
      className="tw-cursor-pointer tw-rounded-md tw-p-1 tw-text-muted-foreground tw-transition-all tw-duration-300 hover:tw-bg-background hover:tw-text-foreground active:tw-scale-95"
      onClick={() => {
        toggleOpen(false);
        setMetaData();
      }}
    >
      <X className="tw-size-4" />
    </div>
  );
}
