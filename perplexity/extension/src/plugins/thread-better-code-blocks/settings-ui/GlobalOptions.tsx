import debounce from "lodash/debounce";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import useOptions from "@/plugins/thread-better-code-blocks/settings-ui/useOptions";

export default function BetterCodeBlockGlobalOptions() {
  const { globalMutation: mutation, globalSettings: settings } = useOptions();

  const debouncedMutate = useMemo(
    () =>
      debounce(
        (mutator: (draft: any) => void) => mutation.mutate(mutator),
        300,
      ),
    [mutation],
  );

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <Switch
        textLabel="Sticky header"
        checked={settings?.plugins["thread:betterCodeBlocks"].stickyHeader}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["thread:betterCodeBlocks"].stickyHeader = checked;
          });
        }}
      />
      <Switch
        textLabel="Show line numbers"
        checked={settings?.plugins["thread:betterCodeBlocks"].showLineNumbers}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["thread:betterCodeBlocks"].showLineNumbers = checked;
          });
        }}
      />
      <div className="x:flex x:flex-col x:gap-2">
        <Switch
          textLabel="Unwrap lines by default"
          checked={settings?.plugins["thread:betterCodeBlocks"].unwrap.enabled}
          onCheckedChange={({ checked }) => {
            mutation.mutate((draft) => {
              draft.plugins["thread:betterCodeBlocks"].unwrap.enabled = checked;
            });
          }}
        />
        <Switch
          textLabel="Show toggle button"
          className="x:ml-8"
          checked={
            settings?.plugins["thread:betterCodeBlocks"].unwrap.showToggleButton
          }
          onCheckedChange={({ checked }) => {
            mutation.mutate((draft) => {
              draft.plugins["thread:betterCodeBlocks"].unwrap.showToggleButton =
                checked;
            });
          }}
        />
      </div>
      <div className="x:flex x:flex-col x:gap-2">
        <div className="x:flex x:gap-2">
          <Switch
            textLabel="Max height"
            checked={
              settings?.plugins["thread:betterCodeBlocks"].maxHeight?.enabled
            }
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["thread:betterCodeBlocks"].maxHeight.enabled =
                  checked;
              });
            }}
          />
          <div className="x:flex x:items-center x:gap-2">
            <Input
              type="number"
              min={300}
              defaultValue={
                settings?.plugins["thread:betterCodeBlocks"].maxHeight?.value
              }
              className="x:w-[100px]"
              disabled={
                !settings?.plugins["thread:betterCodeBlocks"].maxHeight?.enabled
              }
              onChange={(e) => {
                if (Number(e.target.value) < 300) {
                  return;
                }
                debouncedMutate((draft) => {
                  draft.plugins["thread:betterCodeBlocks"].maxHeight.value =
                    Number(e.target.value);
                });
              }}
            />
            <div className="x:text-muted-foreground">px (&gt;= 300px)</div>
          </div>
        </div>
        <Switch
          textLabel="Collapse by default"
          className="x:ml-8"
          checked={
            settings?.plugins["thread:betterCodeBlocks"].maxHeight
              ?.collapseByDefault
          }
          onCheckedChange={({ checked }) => {
            mutation.mutate((draft) => {
              draft.plugins[
                "thread:betterCodeBlocks"
              ].maxHeight.collapseByDefault = checked;
            });
          }}
        />
        <Switch
          textLabel="Show toggle button"
          className="x:ml-8"
          checked={
            settings?.plugins["thread:betterCodeBlocks"].maxHeight
              ?.showToggleButton
          }
          onCheckedChange={({ checked }) => {
            mutation.mutate((draft) => {
              draft.plugins[
                "thread:betterCodeBlocks"
              ].maxHeight.showToggleButton = checked;
            });
          }}
        />
      </div>
      <div className="x:flex x:gap-2">
        <Switch
          textLabel="Max width"
          checked={
            settings?.plugins["thread:betterCodeBlocks"].maxWidth?.enabled
          }
          onCheckedChange={({ checked }) => {
            mutation.mutate((draft) => {
              draft.plugins["thread:betterCodeBlocks"].maxWidth.enabled =
                checked;
            });
          }}
        />
        <div className="x:flex x:items-center x:gap-2">
          <Input
            type="number"
            min={50}
            max={100}
            step={25}
            defaultValue={
              settings?.plugins["thread:betterCodeBlocks"].maxWidth?.value
            }
            className="x:w-[100px]"
            disabled={
              !settings?.plugins["thread:betterCodeBlocks"].maxWidth?.enabled
            }
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value < 50 || value > 100) {
                return;
              }
              debouncedMutate((draft) => {
                draft.plugins["thread:betterCodeBlocks"].maxWidth.value = value;
              });
            }}
          />
          <div className="x:text-muted-foreground">% (50-100%)</div>
        </div>
      </div>
    </div>
  );
}
