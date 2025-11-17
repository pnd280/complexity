import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { InlineCode, Ul } from "@/components/ui/typography";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { PplxLanguageModelsService } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models";
import { useSettings } from "@/plugins/better-search-params/settings";

function BetterSearchParamsPluginSettingsUi() {
  const { settings, update } = useSettings();

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings.enabled}
        onCheckedChange={({ checked }) => {
          void update({
            updateFn: (draft) => {
              draft.enabled = checked;
            },
          });
        }}
      />

      <div className="x:flex x:flex-col x:gap-4">
        <div className="x:flex x:flex-col x:gap-2">
          <div className="x:flex x:items-center x:gap-2">
            <span className="x:text-sm x:text-muted-foreground">
              Query format:
            </span>
            <HoverCard>
              <HoverCardTrigger>
                <div className="x:text-sm x:text-muted-foreground x:underline x:decoration-dashed x:underline-offset-4">
                  (where do I use this?)
                </div>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="x:mx-auto x:w-full x:max-w-[700px]">
                  <Image
                    src="https://images2.imgbox.com/a8/75/vfYWRB5p_o.png"
                    alt="better-search-params"
                    className="x:w-full"
                  />
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <InlineCode>
            https://www.perplexity.ai/<mark>#</mark>?q=%s&model=
            <mark>&#123;model&#125;</mark>
            &focus=<mark>&#123;focus&#125;</mark>&space=
            <mark>&#123;spaceId&#125;</mark>&<mark>incognito</mark>
          </InlineCode>
        </div>

        <Ul className="x:my-0">
          <li>
            <div>
              <span>Available values for </span>
              <InlineCode>&#123;focus&#125;</InlineCode>{" "}
              <span>(separated by commas)</span>:
            </div>
            <InlineCode className="x:ml-1">writing</InlineCode>
            <InlineCode className="x:ml-1">web</InlineCode>
            <InlineCode className="x:ml-1">social</InlineCode>
            <InlineCode className="x:ml-1">scholar</InlineCode>
            <div className="x:inline-block x:space-x-1">
              <InlineCode className="x:ml-1">edgar</InlineCode>
              <span>(Finance)</span>
            </div>
          </li>

          <HoverCard>
            <HoverCardTrigger asChild>
              <li className="x:w-fit x:cursor-pointer x:underline x:decoration-dashed x:underline-offset-4">
                How to find <InlineCode>&#123;spaceId&#125;</InlineCode>?
              </li>
            </HoverCardTrigger>
            <HoverCardContent className="x:flex x:flex-col x:gap-2">
              <div>
                Use the <InlineCode>Command Menu</InlineCode> plugin to find the
                space ID.
              </div>
              <div className="x:mx-auto x:w-full x:max-w-[700px]">
                <Image
                  src="https://images2.imgbox.com/6d/44/1P5GHUdG_o.png"
                  alt="How to find spaceId?"
                  className="x:w-full"
                />
              </div>
            </HoverCardContent>
          </HoverCard>

          <li>
            <span>Available values for </span>
            <InlineCode>&#123;model&#125;</InlineCode>:
            <div className="x:mt-1 x:ml-8 x:flex x:flex-col x:gap-2">
              {Object.values(PplxLanguageModelsService.allModels)
                .flat()
                .filter((model) => !model.isMax && model.label !== "Auto")
                .map((model) => (
                  <div key={model.code}>
                    <span>{model.label}</span>
                    <InlineCode className="x:ml-1">{model.code}</InlineCode>
                  </div>
                ))}
            </div>
          </li>
        </Ul>
      </div>
    </div>
  );
}

export default function () {
  registerSettingsUi({
    pluginId: "betterSearchParams",
    ui: <BetterSearchParamsPluginSettingsUi />,
  });
}
