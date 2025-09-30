import { describe, expect, it } from "vitest";

import { PplxThreadExport } from "@/plugins/__async-deps__/pplx-thread-export";
import type { ThreadMessageApiResponse } from "@/services/externals/pplx-api/pplx-api.types";
import {
  exportedMessageWithCitations,
  exportedMessageWithoutCitations,
  exportedThreadWithCitations,
  exportedThreadWithoutCitations,
  normalThreadApiResponse,
} from "~/tests/data/thread";

describe("ThreadExport", () => {
  describe("exportThread method", () => {
    const instance = new PplxThreadExport({});

    it("should return a thread with citations", () => {
      expect(
        instance.exportThread({
          threadJSON:
            normalThreadApiResponse as unknown as ThreadMessageApiResponse[],
          includeCitations: true,
        }),
      ).toBe(exportedThreadWithCitations);
    });

    it("should return a thread without citations", () => {
      expect(
        instance.exportThread({
          threadJSON:
            normalThreadApiResponse as unknown as ThreadMessageApiResponse[],
          includeCitations: false,
        }),
      ).toBe(exportedThreadWithoutCitations);
    });

    it("should return a message with citations", () => {
      expect(
        instance.exportThread({
          threadJSON:
            normalThreadApiResponse as unknown as ThreadMessageApiResponse[],
          includeCitations: true,
          messageIndex: 0,
        }),
      ).toBe(exportedMessageWithCitations);
    });

    it("should return a message without citations", () => {
      expect(
        instance.exportThread({
          threadJSON:
            normalThreadApiResponse as unknown as ThreadMessageApiResponse[],
          includeCitations: false,
          messageIndex: 0,
        }),
      ).toBe(exportedMessageWithoutCitations);
    });
  });
});
