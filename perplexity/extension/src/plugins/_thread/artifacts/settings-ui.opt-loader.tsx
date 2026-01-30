import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { InlineCode } from "@/components/ui/typography";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { useSettings } from "@/plugins/_thread/artifacts/settings";

function ArtifactsPluginSettingsUi() {
  const { settings, update } = useSettings();

  return (
    <div className="x:flex x:max-w-5xl x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings.enabled}
        onCheckedChange={({ checked }) =>
          void update({
            updateFn(prev) {
              prev.enabled = checked;
            },
          })
        }
      />
      {settings.enabled && (
        <div className="x:flex x:flex-col x:gap-2">
          <p className="x:text-muted-foreground">
            For the AI to acknowledge the ability to use Artifacts, you need to
            use this{" "}
            <a
              href="https://cdn.cplx.app/resources/artifacts-instruction.md"
              target="_blank"
              rel="noopener noreferrer"
              className="x:text-primary x:underline"
            >
              pre-prompt
            </a>
            , either use Space&apos;s Instruction or directly place it before
            the query. Feel free to modify it as you see fit, however make sure
            to follow the specified syntaxes.
          </p>
          <p className="x:text-muted-foreground">
            <span className="x:text-foreground x:underline">Otherwise</span>, A
            &quot;Render in Artifacts&quot; button on the header of applicable
            code blocks will be shown.
          </p>
          <div className="x:mt-6">
            <table className="x:w-full x:border-collapse x:rounded-lg x:border x:border-border">
              <thead>
                <tr className="x:bg-secondary x:text-secondary-foreground">
                  <th className="x:border x:border-border x:p-2"></th>
                  <th className="x:border x:border-border x:p-2 x:font-semibold">
                    Without pre-prompt
                  </th>
                  <th className="x:border x:border-border x:p-2 x:font-semibold">
                    With pre-prompt
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="x:border x:border-border x:bg-secondary x:p-2 x:text-secondary-foreground">
                    AI awareness
                  </td>
                  <td className="x:border x:border-border x:p-2 x:text-center">
                    ❌
                  </td>
                  <td className="x:border x:border-border x:p-2 x:text-center">
                    ✅
                  </td>
                </tr>
                <tr>
                  <td className="x:border x:border-border x:bg-secondary x:p-2 x:text-secondary-foreground">
                    Render condition
                  </td>
                  <td className="x:border x:border-border x:p-2 x:text-center">
                    Manual activation
                  </td>
                  <td className="x:border x:border-border x:p-2 x:text-center">
                    Automatic rendering by the AI
                  </td>
                </tr>
                <tr>
                  <td className="x:border x:border-border x:bg-secondary x:p-2 x:text-secondary-foreground">
                    Supported languages
                  </td>
                  <td className="x:border x:border-border x:p-2">
                    <div className="x:mx-auto x:flex x:w-max x:flex-col x:items-center x:gap-1">
                      <InlineCode className="x:w-max">✅ markdown</InlineCode>
                      <InlineCode className="x:w-max">✅ mermaid</InlineCode>
                      <InlineCode className="x:w-max">✅ markmap</InlineCode>
                      <InlineCode className="x:w-max">✅ plantuml</InlineCode>
                      <InlineCode className="x:w-max">✅ html</InlineCode>
                      <InlineCode className="x:w-max">❌ react</InlineCode>
                    </div>
                  </td>
                  <td className="x:border x:border-border x:p-2">
                    <div className="x:mx-auto x:flex x:w-max x:flex-col x:items-center x:gap-1">
                      <InlineCode className="x:w-max">✅ markdown</InlineCode>
                      <InlineCode className="x:w-max">✅ mermaid</InlineCode>
                      <InlineCode className="x:w-max">✅ markmap</InlineCode>
                      <InlineCode className="x:w-max">✅ plantuml</InlineCode>
                      <InlineCode className="x:w-max">✅ html</InlineCode>
                      <InlineCode className="x:w-max">✅ react</InlineCode>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="x:border x:border-border x:bg-secondary x:p-2 x:text-secondary-foreground">
                    Supported language models
                  </td>
                  <td className="x:border x:border-border x:p-2 x:text-center x:text-muted-foreground">
                    any premium models
                  </td>
                  <td className="x:border x:border-border x:p-2 x:text-center x:text-balance">
                    Works best with any premium models (except Sonar - please
                    don&apos;t use it for any purposes)
                  </td>
                </tr>
                <tr>
                  <td className="x:border x:border-border x:bg-secondary x:p-2 x:text-secondary-foreground">
                    Ease of use
                  </td>
                  <td className="x:border x:border-border x:p-2 x:text-center x:text-muted-foreground">
                    No setup required
                  </td>
                  <td className="x:border x:border-border x:p-2 x:text-center">
                    Requires pre-prompt
                  </td>
                </tr>
                <tr>
                  <td className="x:border x:border-border x:bg-secondary x:p-2 x:text-secondary-foreground">
                    Action
                  </td>
                  <td className="x:border x:border-border x:p-2 x:text-center x:text-muted-foreground">
                    No action required
                  </td>
                  <td className="x:border x:border-border x:p-2 x:text-center">
                    <Button
                      onClick={() => {
                        window.open(
                          "https://perplexity.ai/#/cplx/thread-artifacts/install-pre-prompt-as-space",
                          "_blank",
                        );
                      }}
                    >
                      Install Artifacts pre-prompt as a Space
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Wrapper() {
  "use no memo";

  registerSettingsUi({
    pluginId: "thread:artifacts",
    ui: <ArtifactsPluginSettingsUi />,
  });
}
