import { describe, expect, it } from "vitest";

import { ThreadMessageApiResponse } from "@/types/pplx-api.types";
import ThreadExport from "@/utils/ThreadExport";
import {
  exportedMessageWithCitations,
  exportedMessageWithoutCitations,
  exportedThreadWithCitations,
  exportedThreadWithoutCitations,
  normalThreadApiResponse,
} from "~/tests/mocks/thread";

describe("ThreadExport", () => {
  describe("exportThread method", () => {
    it("should return a thread with citations", () => {
      expect(
        ThreadExport.exportThread({
          threadJSON:
            normalThreadApiResponse as unknown as ThreadMessageApiResponse[],
          includeCitations: true,
        }),
      ).toBe(exportedThreadWithCitations);
    });

    it("should return a thread without citations", () => {
      expect(
        ThreadExport.exportThread({
          threadJSON:
            normalThreadApiResponse as unknown as ThreadMessageApiResponse[],
          includeCitations: false,
        }),
      ).toBe(exportedThreadWithoutCitations);
    });

    it("should return a message with citations", () => {
      expect(
        ThreadExport.exportThread({
          threadJSON:
            normalThreadApiResponse as unknown as ThreadMessageApiResponse[],
          includeCitations: true,
          messageIndex: 0,
        }),
      ).toBe(exportedMessageWithCitations);
    });

    it("should return a message without citations", () => {
      expect(
        ThreadExport.exportThread({
          threadJSON:
            normalThreadApiResponse as unknown as ThreadMessageApiResponse[],
          includeCitations: false,
          messageIndex: 0,
        }),
      ).toBe(exportedMessageWithoutCitations);
    });
  });
});
