import { CircleHelp, HelpCircle } from "lucide-react";

import { canvasLangs } from "@/content-script/components/Canvas/langs";
import useCplxGeneralSettings from "@/cplx-user-settings/hooks/useCplxGeneralSettings";
import Switch from "@/shared/components/Switch";
import Tooltip from "@/shared/components/Tooltip";
import { CanvasLang } from "@/utils/Canvas";

export default function CanvasSettings() {
  const { settings, updateSettings } = useCplxGeneralSettings();

  if (!settings) return null;

  const isCustomMarkdownBlockSettingEnabled =
    settings?.qolTweaks.customMarkdownBlock;

  const canvasSettings = settings.qolTweaks.canvas;

  if (!isCustomMarkdownBlockSettingEnabled)
    return (
      <div className="tw-w-full tw-text-center">
        This feature requires{" "}
        <span className="tw-font-bold tw-text-accent-foreground">
          Custom Markdown Block
        </span>{" "}
        to be enabled.
      </div>
    );

  return (
    <div className="tw-flex tw-flex-col tw-gap-2">
      <h1 className="tw-mx-auto tw-text-xl tw-text-yellow-300">
        ⚠️ This is a <span className="tw-underline">highly experimental</span>{" "}
        feature!
      </h1>
      <div className="tw-text-center">
        <p>
          This feature is still in development and may not work as expected.
        </p>
        <p>
          Enabling this feature may cause performance issues/unexpected
          behavior.
        </p>
        <Switch
          id="canvas-enable"
          textLabel="Enable"
          className="tw-mx-auto tw-mt-4 tw-w-fit"
          checked={canvasSettings.enabled}
          onCheckedChange={({ checked }) => {
            updateSettings("qolTweaks", (draft) => {
              draft.canvas.enabled = checked;
            });
          }}
        />
      </div>

      {canvasSettings.enabled && (
        <div className="tw-mt-4 tw-flex tw-flex-col tw-gap-2 tw-animate-in tw-fade-in">
          <div className="tw-flex tw-items-baseline tw-gap-2">
            <div className="tw-text-lg tw-font-semibold">
              Supported languages:
            </div>
            <div className="tw-text-xs tw-text-muted-foreground">
              All languages below will be enabled.
            </div>
          </div>
          <div className="tw-flex tw-flex-wrap tw-gap-2">
            {canvasLangs.map(
              ({ title, description, trigger, pplxSearch }, index) => (
                <CanvasSettingBlock
                  key={index}
                  pplxSearch={pplxSearch}
                  title={title}
                  trigger={trigger}
                  description={description}
                />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type CanvasSettingBlockProps = {
  pplxSearch: string;
  title: string;
  trigger: CanvasLang;
  description: string;
};

function CanvasSettingBlock({
  pplxSearch,
  title,
  trigger,
  description,
}: CanvasSettingBlockProps) {
  const { settings, updateSettings } = useCplxGeneralSettings();

  if (!settings) return null;

  const canvasSettings = settings.qolTweaks.canvas;

  return (
    <div className="tw-relative tw-flex tw-w-[300px] tw-flex-col tw-gap-4 tw-rounded-md tw-border tw-p-4 tw-shadow-lg">
      {pplxSearch && (
        <a
          className="tw-absolute tw-right-2 tw-top-2"
          href={`https://perplexity.ai/search?q=${encodeURIComponent(pplxSearch)}&focus=internet&copilot=true`}
          target="_blank"
          rel="noreferrer"
        >
          <CircleHelp className="tw-size-3 tw-text-muted tw-transition-all hover:tw-text-muted-foreground" />
        </a>
      )}

      <div className="tw-flex tw-flex-col tw-gap-2">
        <div className="tw-text-base tw-font-semibold tw-text-accent-foreground">
          {title}
        </div>
        <div className="tw-flex tw-items-center tw-gap-1">
          <div>Trigger:</div>
          <div className="tw-w-fit tw-rounded-md tw-bg-secondary tw-p-1 tw-px-2">
            {trigger}
          </div>
        </div>
      </div>

      <div className="tw-text-xs tw-text-muted-foreground">{description}</div>

      <div className="tw-mt-auto tw-flex tw-flex-col tw-gap-2">
        <div className="tw-flex tw-items-center tw-gap-4">
          <Switch
            id={`canvas-lang-${trigger}`}
            textLabel="Mask"
            className="!tw-w-max"
            defaultChecked={canvasSettings.mask[trigger]}
            onCheckedChange={({ checked }) => {
              updateSettings("qolTweaks", (draft) => {
                draft.canvas.mask[trigger] = checked;
              });
            }}
          />
          <Tooltip
            content="Show a compact box instead of the entire code block"
            positioning={{
              placement: "right",
              gutter: 10,
            }}
          >
            <HelpCircle className="tw-size-3 tw-text-muted tw-transition-all hover:tw-text-muted-foreground" />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
