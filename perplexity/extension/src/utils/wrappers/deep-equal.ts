import { createCustomEqual } from "fast-equals";

const isJQuery = (obj: any) => "jquery" in obj;

export const deepEqual = createCustomEqual({
  strict: true,
  createCustomConfig: (defaultConfig) => ({
    ...defaultConfig,
    areObjectsEqual: (a, b, state) => {
      if (isJQuery(a) && isJQuery(b)) {
        return a[0] === b[0];
      }
      return defaultConfig.areObjectsEqual(a, b, state);
    },
  }),
});
