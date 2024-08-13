import { produce } from "immer";
import { merge } from "lodash-es";

import { toast } from "@/shared/toast";
import {
  cplxUserSettingsSchema,
  type CplxUserSettings as CplxUserSettingsType,
} from "@/types/cplx-user-settings.types";
import ChromeStorage from "@/utils/ChromeStorage";
import { compareVersions, isValidVersionString } from "@/utils/utils";
import packageData from "@@/package.json";

export default class CplxUserSettings {
  static defaultUserSettings: CplxUserSettingsType = {
    schemaVersion: packageData.version,
    customTheme: {},
    defaultFocus: "internet",
    defaultWebAccess: false,
    popupSettings: {
      queryBoxSelectors: {
        focus: false,
        languageModel: false,
        imageGenModel: false,
        collection: false,
      },
      qolTweaks: {
        threadToc: false,
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

  private static userSettings: CplxUserSettingsType;

  static async init() {
    const fetchedSettings = await CplxUserSettings.fetch();

    const result = cplxUserSettingsSchema.safeParse(fetchedSettings);

    if (result.success) {
      return (CplxUserSettings.userSettings = result.data);
    }

    const prevVersion = isValidVersionString(fetchedSettings.schemaVersion)
      ? fetchedSettings.schemaVersion
      : "0.0.0.0";

    const isSameSchemaVersion =
      compareVersions(prevVersion, packageData.version) === 0;

    if (isSameSchemaVersion) {
      toast({
        title: "⚠️ [Cplx] User settings schema mismatch",
        description: "Resetting to default.",
      });
    }

    const mergedSettings = !isSameSchemaVersion
      ? merge({}, CplxUserSettings.defaultUserSettings, fetchedSettings)
      : CplxUserSettings.defaultUserSettings;

    mergedSettings.schemaVersion = packageData.version;

    await ChromeStorage.setStore(mergedSettings);

    CplxUserSettings.userSettings = mergedSettings;

    console.log("[Cplx] Merged settings from previous version");
  }

  static async fetch() {
    CplxUserSettings.userSettings = await ChromeStorage.getStore();

    return CplxUserSettings.userSettings;
  }

  static get() {
    return CplxUserSettings.userSettings;
  }

  static async set(updater: (draft: CplxUserSettingsType) => void) {
    const userSettings = await CplxUserSettings.fetch();

    const newSettings = produce(userSettings, (draft) => {
      updater(draft as CplxUserSettingsType);
    });

    await ChromeStorage.setStore(newSettings);

    CplxUserSettings.userSettings = newSettings;

    return newSettings;
  }
}
