import { createCustomEqual } from "fast-equals";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
