import { produce } from "immer";
import { merge } from "lodash";

import { toast } from "@/shared/components/shadcn/ui/use-toast";
import {
  CPLXUserSettingsSchema,
  type CPLXUserSettings as CPLXUserSettingsType,
} from "@/types/CPLXUserSettings";
import ChromeStorage from "@/utils/ChromeStorage";
import { compareVersions, isValidVersionString } from "@/utils/utils";

import packageData from "../../package.json";

export default class CPLXUserSettings {
  static defaultUserSettings: CPLXUserSettingsType = {
    schemaVersion: packageData.version,
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
        noFileCreationOnPaste: false,
        fileDropableThreadWrapper: false,
      },
      visualTweaks: {
        collapseEmptyThreadVisualColumns: false,
      },
    },
  };
  private static userSettings: CPLXUserSettingsType;

  static async init() {
    const fetchedSettings = await CPLXUserSettings.fetch();

    const result = CPLXUserSettingsSchema.safeParse(fetchedSettings);

    if (!result.success) {
      const prevVersion = isValidVersionString(fetchedSettings.schemaVersion)
        ? fetchedSettings.schemaVersion
        : "0.0.0.0";

      const sameSchemaVersion =
        compareVersions(prevVersion, packageData.version) === 0;

      if (sameSchemaVersion) {
        toast({
          title: "⚠️ [CPLX] User settings schema mismatch",
          description: "Resetting to default.",
        });
      }

      const mergedSettings = !sameSchemaVersion
        ? merge({}, CPLXUserSettings.defaultUserSettings, fetchedSettings)
        : CPLXUserSettings.defaultUserSettings;

      mergedSettings.schemaVersion = packageData.version;

      await ChromeStorage.setStore(mergedSettings);

      CPLXUserSettings.userSettings = mergedSettings;

      console.log("[CPLX] Merged settings from previous version");

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
