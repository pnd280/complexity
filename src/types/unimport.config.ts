import * as path from "path";

import { UnimportPluginOptions } from "unimport/unplugin";

const unimportConfig: Partial<UnimportPluginOptions> = {
  dts: "./src/types/unimport.d.ts",
  presets: [
    "react",
    {
      from: "react",
      imports: ["lazy", "forwardRef", "createContext", "useDeferredValue"],
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
      from: path.posix.join(
        ...path.resolve(process.cwd(), "src/utils/cn.ts").split(path.sep),
      ),
    },
  ],
};

export default unimportConfig;
