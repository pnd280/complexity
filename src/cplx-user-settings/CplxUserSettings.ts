import { produce } from "immer";
import { merge } from "lodash-es";

import {
  cplxUserSettingsSchema,
  type CplxUserSettings as CplxUserSettingsType,
} from "@/cplx-user-settings/types/cplx-user-settings.types";
import ChromeStorage from "@/utils/ChromeStorage";
import packageData from "@@/package.json";

export default class CplxUserSettings {
  static defaultUserSettings: CplxUserSettingsType = {
    schemaVersion: packageData.version,
    customTheme: {},
    defaultFocus: "internet",
    defaultWebAccess: false,
    generalSettings: {
      queryBoxSelectors: {
        focus: false,
        languageModel: false,
        imageGenModel: false,
        collection: false,
      },
      qolTweaks: {
        threadToc: false,
        threadMessageStickyToolbar: false,
        customMarkdownBlock: false,
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

    const mergedSettings = merge(
      {},
      CplxUserSettings.defaultUserSettings,
      fetchedSettings,
    );

    mergedSettings.schemaVersion = packageData.version;

    await ChromeStorage.setStore(mergedSettings);

    CplxUserSettings.userSettings = mergedSettings;

    console.log("[Cplx] Settings schema mismatch, updated to latest version");
  }

  static async fetch() {
    CplxUserSettings.userSettings = await ChromeStorage.getStore();

    return CplxUserSettings.userSettings;
  }

  static get() {
    if (CplxUserSettings.userSettings == null) {
      throw new Error("User settings not initialized");
    }

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
