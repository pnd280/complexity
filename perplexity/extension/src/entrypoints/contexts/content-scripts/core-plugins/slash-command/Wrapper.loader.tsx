import { lazily } from "react-lazily";

import { useExternalPagesRegistry } from "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/pages/ExternalPages";
import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";

const { SlashCommandMenu } = lazily(
  () =>
    import("@/entrypoints/contexts/content-scripts/core-plugins/slash-command/SlashCommandMenu"),
);

function SlashCommandMenuWrapper() {
  const shouldEnable = useExternalPagesRegistry(
    (store) => store.components.size > 0,
  );

  return (
    <CsUiGuard
      dependentPluginIds={["slashCommand"]}
      additionalCheck={() => shouldEnable}
    >
      <SlashCommandMenu />
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "corePlugin:slashCommandMenu",
    component: <SlashCommandMenuWrapper />,
  });
}
