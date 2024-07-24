import { produce } from "immer";

import { toast } from "@/shared/components/shadcn/ui/use-toast";
import {
  CPLXUserSettingsSchema,
  type CPLXUserSettings as CPLXUserSettingsType,
} from "@/types/CPLXUserSettings";
import ChromeStorage from "@/utils/ChromeStorage";

export default class CPLXUserSettings {
  static defaultUserSettings: CPLXUserSettingsType = {
    customTheme: {},
    defaultFocus: "internet",
    defaultWebAccess: false,
    secretMode: false,
    popupSettings: {
      queryBoxSelectors: {
        focus: false,
        languageModel: false,
        imageGenModel: false,
        collection: false,
      },
      qolTweaks: {
        threadTOC: false,
        threadMessageStickyToolbar: false,
        alternateMarkdownBlock: false,
        canvas: {
          enabled: false,
          mask: {},
        },
        autoRefreshSessionTimeout: false,
        blockTelemetry: false,
      },
      visualTweaks: {
        collapseEmptyThreadVisualColumns: false,
      },
    },
  };
  private static userSettings: CPLXUserSettingsType;

  static async init() {
    const result = CPLXUserSettingsSchema.safeParse(
      await CPLXUserSettings.fetch(),
    );

    if (!result.success) {
      toast({
        title: "⚠️ [CPLX] User settings schema mismatch",
        description: "Resetting to default.",
        timeout: 999999,
      });

      await ChromeStorage.setStore(CPLXUserSettings.defaultUserSettings);

      CPLXUserSettings.userSettings = CPLXUserSettings.defaultUserSettings;

      return;
    }

    CPLXUserSettings.userSettings = result.data;
  }

  static async fetch() {
    CPLXUserSettings.userSettings = await ChromeStorage.getStore();
    return CPLXUserSettings.userSettings;
  }

  static get() {
    return CPLXUserSettings.userSettings;
  }

  static async set(updater: (draft: CPLXUserSettingsType) => void) {
    const userSettings = await CPLXUserSettings.fetch();

    const newSettings = produce(userSettings, (draft) => {
      updater(draft as CPLXUserSettingsType);
    });

    await ChromeStorage.setStore(newSettings);

    CPLXUserSettings.userSettings = newSettings;

    return newSettings;
  }
}
