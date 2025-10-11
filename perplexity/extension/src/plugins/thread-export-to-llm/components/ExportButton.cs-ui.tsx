import React from "react";
import { lazily } from "react-lazily";

import type { UiGroupId } from "@/__registries__/cs-ui/types";
import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { default: ExportButtonContent } = lazily(
  () => import("@/plugins/thread-export-to-llm/components/ExportButtonContent"),
);

const ExportButtonWrapper = withPluginsGuard(ExportButtonContent, {
  dependentPluginIds: ["threadExportToLlm"],
  location: ["thread"],
});

export const uiGroup: UiGroupId = "thread:messageBlocks:footer";

export default ExportButtonWrapper;
