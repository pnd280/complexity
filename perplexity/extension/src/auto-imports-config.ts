import type { UnimportPluginOptions } from "unimport/unplugin";

const unimportConfig: Partial<UnimportPluginOptions> = {
  dts: false,
  presets: [
    "react",
    {
      from: "react",
      imports: ["createContext", "lazy", "memo", "use", "useDeferredValue"],
    },
    {
      from: "@complexity/i18n",
      imports: ["Trans", "TransWithPrefix", "extendT", "t"],
    },
    {
      from: "@/types/keys.ts",
      imports: ["Key"],
    },
    {
      from: "@/utils/misc/utils.ts",
      imports: ["invariant", "isMainWorldContext", "sleep"],
    },
    {
      from: "@/utils/wrappers/cn.ts",
      imports: ["cn", "tw"],
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
      name: "default",
      as: "ms",
      from: "ms",
    },
  ],
};

export default unimportConfig;
