import { describe, expect, it } from "vitest";

import { ThreadMessageApiResponse } from "@/types/pplx-api.types";
import ThreadExport from "@/utils/ThreadExport";
import {
  exportedNormalThreadWithCitations,
  exportedNormalThreadWithoutCitations,
  normalThreadApiResponse,
} from "@@/tests/mocks/thread";

describe("ThreadExport", () => {
  describe("exportThread method", () => {
    it("should return a thread with citations", () => {
      expect(
        ThreadExport.exportThread({
          threadJSON:
            normalThreadApiResponse as unknown as ThreadMessageApiResponse[],
          includeCitations: true,
        }),
      ).toBe(exportedNormalThreadWithCitations);
    });

    it("should return a thread without citations", () => {
      expect(
        ThreadExport.exportThread({
          threadJSON:
            normalThreadApiResponse as unknown as ThreadMessageApiResponse[],
          includeCitations: false,
        }),
      ).toBe(exportedNormalThreadWithoutCitations);
    });
  });
});
