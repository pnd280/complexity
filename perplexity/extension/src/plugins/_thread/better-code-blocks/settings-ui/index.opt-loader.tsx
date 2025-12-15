import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { Switch } from "@/components/ui/switch";
import { Tabs, TabContent, TabsList, TabTrigger } from "@/components/ui/tabs";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { betterCodeBlocksFineGrainedOptionsQueries } from "@/plugins/_thread/better-code-blocks/indexed-db/query-keys";
import { useSettings } from "@/plugins/_thread/better-code-blocks/settings";
import CreateNewLanguageOptionButton from "@/plugins/_thread/better-code-blocks/settings-ui/CreateNewLanguageOptionButton";
import BetterCodeBlockFineGrainedOptions from "@/plugins/_thread/better-code-blocks/settings-ui/FineGrainedOptions";
import BetterCodeBlockGlobalOptions from "@/plugins/_thread/better-code-blocks/settings-ui/GlobalOptions";

function BetterCodeBlocksPluginSettingsUi() {
  const { settings } = useSettings();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "global";

  const { data: fineGrainedOptions } = useQuery(
    betterCodeBlocksFineGrainedOptionsQueries.list.detail(),
  );

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <Header />

      {settings.enabled && (
        <Tabs
          value={activeTab}
          onValueChange={({ value }) => {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set("tab", value);
            setSearchParams(newSearchParams, {
              replace: true,
            });
          }}
        >
          <TabsList className="x:mb-2 x:justify-start">
            <TabTrigger value="global">Global</TabTrigger>
            {fineGrainedOptions?.map((option) => (
              <TabTrigger key={option.language} value={option.language}>
                {option.language}
              </TabTrigger>
            ))}
            <CreateNewLanguageOptionButton />
          </TabsList>
          <TabContent
            value="global"
            className="x:max-w-[500px] x:rounded-md x:bg-secondary x:p-4"
          >
            <BetterCodeBlockGlobalOptions />
          </TabContent>
          {fineGrainedOptions?.map((option) => (
            <TabContent
              key={option.language}
              value={option.language}
              className="x:rounded-md x:bg-secondary x:p-4"
            >
              <BetterCodeBlockFineGrainedOptions language={option.language} />
            </TabContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

function Header() {
  const { settings, update } = useSettings();

  return (
    <>
      <div className="x:flex x:flex-col x:gap-2">
        Customize the appearance and usability of code blocks.
      </div>
      <Switch
        textLabel="Enable"
        checked={settings.enabled}
        onCheckedChange={({ checked }) => {
          void update({
            updateFn(_draft) {
              _draft.enabled = checked;
            },
          });
        }}
      />
    </>
  );
}

export default function () {
  registerSettingsUi({
    pluginId: "thread:betterCodeBlocks",
    ui: <BetterCodeBlocksPluginSettingsUi />,
  });
}
