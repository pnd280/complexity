import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { useExternalPagesRegistry } from "@/plugins/__core__/slash-command/pages/ExternalPages";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";

const { SlashCommandMenu } = lazily(
  () => import("@/plugins/__core__/slash-command/SlashCommandMenu"),
);

function SlashCommandMenuWrapper() {
  const shouldEnable = useExternalPagesRegistry(
    (store) => store.components.length > 0,
  );

  return (
    <CsUiPluginsGuard
      dependentCorePluginIds={["slashCommand"]}
      additionalCheck={() => shouldEnable}
    >
      <SlashCommandMenu />
    </CsUiPluginsGuard>
  );
}

export default function loader() {
  csUiRootComponentsRegistry.getState().add(<SlashCommandMenuWrapper />);
}
