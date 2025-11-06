import debounce from "lodash/debounce";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DeleteLanguageOptionButton } from "@/plugins/thread-better-code-blocks/settings-ui/DeleteLanguageOptionButton";
import useOptions from "@/plugins/thread-better-code-blocks/settings-ui/useOptions";
import type { BetterCodeBlockFineGrainedOptions } from "@/plugins/thread-better-code-blocks/types";
import type { DeepPartial } from "@/types/utils.types";

export default function BetterCodeBlockFineGrainedOptions({
  language,
}: {
  language: string;
}) {
  const {
    mutation,
    settings,
    delete: deleteMutation,
  } = useOptions({ language });

  const debouncedMutate = debounce(
    (newDraft: DeepPartial<BetterCodeBlockFineGrainedOptions>) =>
      mutation.mutate({
        language,
        newDraft,
      }),
    300,
  );

  if (!settings) return null;

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <Switch
        textLabel="Sticky header"
        checked={settings.stickyHeader}
        onCheckedChange={({ checked }) => {
          mutation.mutate({
            language,
            newDraft: {
              stickyHeader: checked,
            },
          });
        }}
      />
      <Switch
        textLabel="Show line numbers"
        checked={settings.showLineNumbers}
        onCheckedChange={({ checked }) => {
          mutation.mutate({
            language,
            newDraft: {
              showLineNumbers: checked,
            },
          });
        }}
      />

      <div className="x:flex x:flex-col x:gap-2">
        <Switch
          textLabel="Unwrap lines by default"
          checked={settings.unwrap.enabled}
          onCheckedChange={({ checked }) => {
            mutation.mutate({
              language,
              newDraft: {
                unwrap: {
                  enabled: checked,
                },
              },
            });
          }}
        />
        <Switch
          textLabel="Show toggle button"
          className="x:ml-8"
          checked={settings.unwrap.showToggleButton}
          onCheckedChange={({ checked }) => {
            mutation.mutate({
              language,
              newDraft: {
                unwrap: {
                  showToggleButton: checked,
                },
              },
            });
          }}
        />
      </div>
      <div className="x:flex x:flex-col x:gap-2">
        <div className="x:flex x:gap-2">
          <Switch
            textLabel="Max height"
            checked={settings.maxHeight.enabled}
            onCheckedChange={({ checked }) => {
              mutation.mutate({
                language,
                newDraft: {
                  maxHeight: {
                    enabled: checked,
                  },
                },
              });
            }}
          />
          <div className="x:flex x:items-center x:gap-2">
            <Input
              type="number"
              min={0}
              defaultValue={settings.maxHeight.value}
              className="x:w-[100px]"
              disabled={!settings.maxHeight.enabled}
              onChange={(e) => {
                if (Number(e.target.value) < 0) {
                  return;
                }
                debouncedMutate({
                  maxHeight: {
                    value: Number(e.target.value),
                  },
                });
              }}
            />
            <div className="x:text-muted-foreground">
              px (0px = entirely collapsed)
            </div>
          </div>
        </div>
        {settings.maxHeight.enabled && (
          <>
            <Switch
              textLabel="Collapse by default"
              className="x:ml-8"
              checked={settings.maxHeight.collapseByDefault}
              onCheckedChange={({ checked }) => {
                mutation.mutate({
                  language,
                  newDraft: {
                    maxHeight: {
                      collapseByDefault: checked,
                    },
                  },
                });
              }}
            />
            <Switch
              textLabel="Show toggle button"
              className="x:ml-8"
              checked={settings.maxHeight.showToggleButton}
              onCheckedChange={({ checked }) => {
                mutation.mutate({
                  language,
                  newDraft: {
                    maxHeight: {
                      showToggleButton: checked,
                    },
                  },
                });
              }}
            />
          </>
        )}
      </div>
      <div className="x:flex x:gap-2">
        <Switch
          textLabel="Max width"
          checked={settings.maxWidth.enabled}
          onCheckedChange={({ checked }) => {
            mutation.mutate({
              language,
              newDraft: {
                maxWidth: {
                  enabled: checked,
                },
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
            defaultValue={settings.maxWidth.value}
            className="x:w-[100px]"
            disabled={!settings.maxWidth.enabled}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value < 50 || value > 100) {
                return;
              }
              debouncedMutate({
                maxWidth: {
                  value: value,
                },
              });
            }}
          />
          <div className="x:text-muted-foreground">% (50-100%)</div>
        </div>
      </div>
      <div className="x:flex x:flex-col x:gap-2">
        <Switch
          textLabel="Custom placeholder text"
          checked={settings.placeholderText.enabled}
          onCheckedChange={({ checked }) => {
            mutation.mutate({
              language,
              newDraft: {
                placeholderText: {
                  enabled: checked,
                },
              },
            });
          }}
        />
        {settings.placeholderText.enabled && (
          <div className="x:ml-8 x:flex x:flex-col x:gap-2">
            <div>
              <Label className="x:text-muted-foreground">Title</Label>
              <Input
                type="text"
                maxLength={30}
                defaultValue={settings.placeholderText.title}
                className="x:w-[300px]"
                onChange={(e) => {
                  debouncedMutate({
                    placeholderText: { title: e.target.value },
                  });
                }}
              />
            </div>
            <div>
              <Label className="x:text-muted-foreground">Loading text</Label>
              <Input
                type="text"
                maxLength={30}
                defaultValue={settings.placeholderText.loading}
                className="x:w-[300px]"
                onChange={(e) => {
                  debouncedMutate({
                    placeholderText: { loading: e.target.value },
                  });
                }}
              />
            </div>
            <div>
              <Label className="x:text-muted-foreground">Idle text</Label>
              <Input
                type="text"
                maxLength={30}
                defaultValue={settings.placeholderText.idle}
                className="x:w-[300px]"
                onChange={(e) => {
                  debouncedMutate({
                    placeholderText: { idle: e.target.value },
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="x:ml-auto x:flex x:flex-col x:gap-2">
        <DeleteLanguageOptionButton deleteMutation={deleteMutation.mutate} />
      </div>
    </div>
  );
}
