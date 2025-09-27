import { useMutation } from "@tanstack/react-query";
import { LuCodesandbox, LuLoaderCircle } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { artifactsStore } from "@/plugins/artifacts/store";
import { createSandbox } from "@/utils/wrappers/sandpack";

export default function SandpackArtifactActionButtonsWrapper() {
  const { mutate: createCodeSandbox, isPending } = useMutation({
    mutationKey: ["create-code-sandbox"],
    mutationFn: async () => {
      const files = artifactsStore.getState().sandpackPreviewRef?.getClient()
        ?.sandboxSetup.files;

      if (!files) return;

      const url = await createSandbox(files);

      window.open(url, "_blank");
    },
  });

  return (
    <div className="x:flex x:items-center x:gap-1">
      <Tooltip content={t("plugin-artifacts.tooltip.openInCodeSandbox")}>
        <Button
          variant="ghost"
          size="iconSm"
          disabled={isPending}
          onClick={() => {
            createCodeSandbox();
          }}
        >
          {isPending ? (
            <LuLoaderCircle className="x:size-4 x:animate-spin" />
          ) : (
            <LuCodesandbox className="x:size-4" />
          )}
        </Button>
      </Tooltip>
    </div>
  );
}
