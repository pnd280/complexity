import type { UnimportPluginOptions } from "unimport/unplugin";

const unimportConfig: Partial<UnimportPluginOptions> = {
  dts: false,
  presets: [
    "react",
    {
      from: "react",
      imports: ["lazy", "use", "createContext", "useDeferredValue", "memo"],
    },
    {
      from: "@/utils/wrappers/js-context-guards.ts",
      imports: ["onlyMainWorldGuard", "onlyExtensionGuard"],
    },
    {
      from: "@/utils/misc/utils.ts",
      imports: [
        "sleep",
        "isMainWorldContext",
        "isExtensionContext",
        "invariant",
      ],
    },
    {
      from: "@/utils/wrappers/deep-equal.ts",
      imports: ["deepEqual"],
    },
    {
      from: "@complexity/i18n",
      imports: ["t", "extendT", "Trans", "TransWithPrefix"],
    },
  ],
  imports: [
    {
      name: "default",
      as: "$",
      from: "jquery",
    },
    {
      name: "cn",
      from: "@/utils/wrappers/cn.ts",
    },
    {
      name: "Key",
      from: "ts-key-enum",
    },
  ],
};

export default unimportConfig;
