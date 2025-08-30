import { declarativeNetRequestListener } from "@/entrypoints/background/declarative-net-request";
import { contentScriptListeners } from "@/entrypoints/background/listeners/content-script";
import { createDashboardShortcut } from "@/entrypoints/background/listeners/dashboard-shortcut";
import { extensionIconActionListener } from "@/entrypoints/background/listeners/extension-icon-action";
import { onboardingFlowTrigger } from "@/entrypoints/background/listeners/onboarding-flow-trigger";

export function setupBackgroundListeners() {
  extensionIconActionListener();
  onboardingFlowTrigger();
  createDashboardShortcut();
  contentScriptListeners();
  declarativeNetRequestListener();

  const entries = import.meta.glob("@/**/*.background-listener.ts", {
    eager: true,
  }) as Record<string, { default: () => void }>;

  for (const [path, module] of Object.entries(entries)) {
    const listener = module.default;

    invariant(
      typeof listener == "function",
      `listener is not a function in ${path}`,
    );

    listener();
  }
}
