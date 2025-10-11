import React from "react";
import { createListCollection } from "@ark-ui/react";

import type { PluginId } from "@/__registries__/plugins/meta.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

type ExportFormat = "json" | "markdown" | "plaintext";
type TargetLlm = "ai-studio" | "claude" | "chatgpt" | "custom";

const EXPORT_FORMAT_LABELS: Record<ExportFormat, string> = {
  markdown: "Markdown",
  json: "JSON",
  plaintext: "Plain Text",
};

const EXPORT_FORMAT_OPTIONS: ExportFormat[] = ["markdown", "json", "plaintext"];

const formatCollection = createListCollection<ExportFormat>({
  items: EXPORT_FORMAT_OPTIONS,
  itemToString: (item) => EXPORT_FORMAT_LABELS[item],
});

const TARGET_LLM_LABELS: Record<TargetLlm, string> = {
  "ai-studio": "Google AI Studio",
  claude: "Claude",
  chatgpt: "ChatGPT",
  custom: "Custom URL",
};

const TARGET_LLM_OPTIONS: TargetLlm[] = [
  "ai-studio",
  "claude",
  "chatgpt",
  "custom",
];

const targetLlmCollection = createListCollection<TargetLlm>({
  items: TARGET_LLM_OPTIONS,
  itemToString: (item) => TARGET_LLM_LABELS[item],
});

export const pluginId: PluginId = "threadExportToLlm";

export default function ThreadExportToLlmSettingsUi() {
  const { settings, mutation } = useExtensionSettings();
  const pluginSettings = settings?.plugins.threadExportToLlm;

  if (!settings) return null;

  return (
    <div className="x:flex x:max-w-2xl x:flex-col x:gap-6">
      {/* Enable/Disable Toggle */}
      <div className="x:space-y-2">
        <Switch
          textLabel="Enable Thread Export to LLM"
          checked={pluginSettings?.enabled ?? false}
          onCheckedChange={({ checked }) => {
            mutation.mutate((draft) => {
              draft.plugins.threadExportToLlm.enabled = checked;
            });
          }}
        />
        <p className="x:text-sm x:text-muted-foreground">
          Export entire conversation threads with context to other LLMs
        </p>
      </div>

      {/* Export Format Selector */}
      <div className="x:space-y-2">
        <Label htmlFor="export-format">Export Format</Label>
        <Select
          portal={false}
          collection={formatCollection}
          value={[pluginSettings?.exportFormat ?? "markdown"]}
          positioning={{ sameWidth: true }}
          onValueChange={({ value }) => {
            mutation.mutate((draft) => {
              draft.plugins.threadExportToLlm.exportFormat = value[0] as ExportFormat;
            });
          }}
        >
          <SelectTrigger id="export-format" variant="default" className="x:w-fit x:p-4 x:py-2">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            {EXPORT_FORMAT_OPTIONS.map((option) => (
              <SelectItem key={option} item={option}>
                {EXPORT_FORMAT_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="x:text-sm x:text-muted-foreground">
          Choose the format for exported thread content
        </p>
      </div>

      {/* Include Metadata Checkbox */}
      <div className="x:space-y-2">
        <Switch
          textLabel="Include Metadata"
          checked={pluginSettings?.includeMetadata ?? true}
          onCheckedChange={({ checked }) => {
            mutation.mutate((draft) => {
              draft.plugins.threadExportToLlm.includeMetadata = checked;
            });
          }}
        />
        <p className="x:text-sm x:text-muted-foreground">
          Include thread metadata (title, model, timestamp) in exports
        </p>
      </div>

      {/* Target LLM Selector */}
      <div className="x:space-y-2">
        <Label htmlFor="target-llm">Target LLM</Label>
        <Select
          portal={false}
          collection={targetLlmCollection}
          value={[pluginSettings?.targetLlm ?? "ai-studio"]}
          positioning={{ sameWidth: true }}
          onValueChange={({ value }) => {
            mutation.mutate((draft) => {
              draft.plugins.threadExportToLlm.targetLlm = value[0] as TargetLlm;
            });
          }}
        >
          <SelectTrigger id="target-llm" variant="default" className="x:w-fit x:p-4 x:py-2">
            <SelectValue placeholder="Select LLM" />
          </SelectTrigger>
          <SelectContent>
            {TARGET_LLM_OPTIONS.map((option) => (
              <SelectItem key={option} item={option}>
                {TARGET_LLM_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="x:text-sm x:text-muted-foreground">
          Select which LLM to open after exporting
        </p>
      </div>

      {/* Custom API Endpoint (conditionally shown) */}
      {pluginSettings?.targetLlm === "custom" && (
        <div className="x:space-y-2">
          <Label htmlFor="custom-endpoint">Custom API Endpoint</Label>
          <Input
            id="custom-endpoint"
            type="url"
            placeholder="https://example.com/api"
            value={pluginSettings?.customApiEndpoint ?? ""}
            onChange={(e) => {
              mutation.mutate((draft) => {
                draft.plugins.threadExportToLlm.customApiEndpoint =
                  e.target.value;
              });
            }}
          />
          <p className="x:text-sm x:text-muted-foreground">
            Enter the URL to open when exporting with custom target
          </p>
        </div>
      )}

      {/* Info Section */}
      <div className="x:rounded-lg x:border x:border-border x:p-4">
        <h3 className="x:mb-2 x:font-semibold">How to use:</h3>
        <ol className="x:list-decimal x:space-y-1 x:pl-5 x:text-sm x:text-muted-foreground">
          <li>Navigate to any Perplexity thread</li>
          <li>Click the export button in the thread footer</li>
          <li>The thread content will be copied to your clipboard</li>
          <li>Your selected LLM will open in a new tab</li>
          <li>Paste the content into the LLM to continue the conversation</li>
        </ol>
      </div>
    </div>
  );
}
