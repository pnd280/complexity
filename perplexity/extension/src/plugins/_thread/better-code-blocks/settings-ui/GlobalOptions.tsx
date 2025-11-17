import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import useOptions from "@/plugins/_thread/better-code-blocks/settings-ui/useOptions";

export default function BetterCodeBlockGlobalOptions() {
  const { globalRuleUpdate, globalRuleSettings } = useOptions();

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <Switch
        textLabel="Sticky header"
        checked={globalRuleSettings.stickyHeader}
        onCheckedChange={({ checked }) => {
          void globalRuleUpdate({
            updateFn(prev) {
              prev.stickyHeader = checked;
            },
          });
        }}
      />
      <Switch
        textLabel="Show line numbers"
        checked={globalRuleSettings.showLineNumbers}
        onCheckedChange={({ checked }) => {
          void globalRuleUpdate({
            updateFn(prev) {
              prev.showLineNumbers = checked;
            },
          });
        }}
      />
      <div className="x:flex x:flex-col x:gap-2">
        <Switch
          textLabel="Unwrap lines by default"
          checked={globalRuleSettings.unwrap.enabled}
          onCheckedChange={({ checked }) => {
            void globalRuleUpdate({
              updateFn(prev) {
                prev.unwrap.enabled = checked;
              },
            });
          }}
        />
        <Switch
          textLabel="Show toggle button"
          className="x:ml-8"
          checked={globalRuleSettings.unwrap.showToggleButton}
          onCheckedChange={({ checked }) => {
            void globalRuleUpdate({
              updateFn(prev) {
                prev.unwrap.showToggleButton = checked;
              },
            });
          }}
        />
      </div>
      <div className="x:flex x:flex-col x:gap-2">
        <div className="x:flex x:gap-2">
          <Switch
            textLabel="Max height"
            checked={globalRuleSettings.maxHeight.enabled}
            onCheckedChange={({ checked }) => {
              void globalRuleUpdate({
                updateFn(prev) {
                  prev.maxHeight.enabled = checked;
                },
              });
            }}
          />
          <div className="x:flex x:items-center x:gap-2">
            <Input
              type="number"
              min={300}
              defaultValue={globalRuleSettings.maxHeight.value}
              className="x:w-[100px]"
              disabled={!globalRuleSettings.maxHeight.enabled}
              onChange={(e) => {
                if (Number(e.target.value) < 300) {
                  return;
                }
                void globalRuleUpdate({
                  updateFn(prev) {
                    prev.maxHeight.value = Number(e.target.value);
                  },
                });
              }}
            />
            <div className="x:text-muted-foreground">px (&gt;= 300px)</div>
          </div>
        </div>
        <Switch
          textLabel="Collapse by default"
          className="x:ml-8"
          checked={globalRuleSettings.maxHeight.collapseByDefault}
          onCheckedChange={({ checked }) => {
            void globalRuleUpdate({
              updateFn(prev) {
                prev.maxHeight.collapseByDefault = checked;
              },
            });
          }}
        />
        <Switch
          textLabel="Show toggle button"
          className="x:ml-8"
          checked={globalRuleSettings.maxHeight.showToggleButton}
          onCheckedChange={({ checked }) => {
            void globalRuleUpdate({
              updateFn(prev) {
                prev.maxHeight.showToggleButton = checked;
              },
            });
          }}
        />
      </div>
      <div className="x:flex x:gap-2">
        <Switch
          textLabel="Max width"
          checked={globalRuleSettings.maxWidth.enabled}
          onCheckedChange={({ checked }) => {
            void globalRuleUpdate({
              updateFn(prev) {
                prev.maxWidth.enabled = checked;
              },
            });
          }}
        />
        <div className="x:flex x:items-center x:gap-2">
          <Input
            type="number"
            min={50}
            max={100}
            step={25}
            defaultValue={globalRuleSettings.maxWidth.value}
            className="x:w-[100px]"
            disabled={!globalRuleSettings.maxWidth.enabled}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value < 50 || value > 100) {
                return;
              }
              void globalRuleUpdate({
                updateFn(prev) {
                  prev.maxWidth.value = value;
                },
              });
            }}
          />
          <div className="x:text-muted-foreground">% (50-100%)</div>
        </div>
      </div>
    </div>
  );
}
