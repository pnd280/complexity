import { useMutation } from "@tanstack/react-query";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { artifactsStore } from "@/plugins/_thread/artifacts/store";
import { createSandbox } from "@/plugins/_thread/artifacts/utils/sandpack";

import TablerBrandCodesandbox from "~icons/tabler/brand-codesandbox";
import TablerLoaderCircle from "~icons/tabler/loader-2";

export default function SandpackArtifactActionButtonsWrapper() {
  const { mutate: createCodeSandbox, isPending } = useMutation({
    mutationKey: ["create-code-sandbox"],
    mutationFn: async () => {
      const files = artifactsStore
        .getState()
        .preview.sandpackPreviewRef?.getClient()?.sandboxSetup.files;

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
            <TablerLoaderCircle className="x:size-4 x:animate-spin" />
          ) : (
            <TablerBrandCodesandbox className="x:size-4" />
          )}
        </Button>
      </Tooltip>
    </div>
  );
}
