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
      from: "@complexity/i18n",
      imports: ["t", "extendT", "Trans", "TransWithPrefix"],
    },
    {
      from: "@/utils/misc/utils.ts",
      imports: ["sleep", "isMainWorldContext", "invariant"],
    },
    {
      from: "@/utils/wrappers/deep-equal.ts",
      imports: ["deepEqual"],
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
      from: "@/types/keys.ts",
    },
  ],
};

export default unimportConfig;
