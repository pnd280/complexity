import { describe, it, expect } from "vitest";

import { WsParsedMessage } from "@/types/ws.types";
import WsMessageParser from "@/utils/WsMessageParser";
import {
  pingMessages,
  pongMessages,
  commonFormatMessage,
  longerCommonFormatMessage,
  opus50RateLimitMessage,
  longerMessageNoEvent,
  messageNoEventDataAsArray,
} from "@@/tests/mocks/ws-messages";

describe("WsMessageParser", () => {
  describe("parse method", () => {
    it("should parse ping messages", () => {
      expect(WsMessageParser.parse(pingMessages[0])).toBe(pingMessages[0]);
      expect(WsMessageParser.parse(pingMessages[1])).toBe(pingMessages[1]);
    });

    it("should parse pong messages", () => {
      expect(WsMessageParser.parse(pongMessages[0])).toBe(pongMessages[0]);
    });

    it("should parse common format messages", () => {
      const expected: WsParsedMessage = {
        messageCode: 421,
        event: "list_user_collections",
        data: [{ version: "2.9", source: "default", limit: 50, offset: 0 }],
      };
      expect(WsMessageParser.parse(commonFormatMessage)).toEqual(expected);
    });

    it("should parse longer common format messages", () => {
      const expected: WsParsedMessage = {
        messageCode: 420,
        event: "save_user_ai_profile",
        data: [
          {
            version: "2.9",
            source: "default",
            action: "save_profile",
            disabled: false,
            bio: "<writing_style>\n- No unnecessary pre-text, greetings, apologies, etc.\n- Use a variety of markdown syntaxes.\n- Prefer table for comparisons.\n</writing_style>",
            location: "",
            response_language: "autodetect",
            questions_answers: [],
          },
        ],
      };
      expect(WsMessageParser.parse(longerCommonFormatMessage)).toEqual(
        expected,
      );
    });

    it(`should parse "Opus 50 😭"`, () => {
      const expected: WsParsedMessage = {
        messageCode: 433,
        event: "",
        data: [{ remaining: 50 }],
      };
      expect(WsMessageParser.parse(opus50RateLimitMessage)).toEqual(expected);
    });

    it("should parse longer messages with no event", () => {
      const expected: WsParsedMessage = {
        messageCode: 430,
        event: "",
        data: [
          {
            has_profile: true,
            disabled: false,
            bio: "<writing_style>\n- No unnecessary pre-text, greetings, apologies, etc.\n- Use a variety of markdown syntaxes.\n- Prefer table for comparisons.\n</writing_style>",
            location: "",
            language: "autodetect",
            response_language: "autodetect",
            questions_answers: [],
            location_lat: null,
            location_lng: null,
          },
        ],
      };
      expect(WsMessageParser.parse(longerMessageNoEvent)).toEqual(expected);
    });

    it("should parse messages with no event and data as array", () => {
      const parsed = WsMessageParser.parse(
        messageNoEventDataAsArray,
      ) as WsParsedMessage;
      expect(parsed.messageCode).toBe(431);
      expect(parsed.event).toBe("");
      expect(Array.isArray(parsed.data)).toBe(true);
      expect(parsed.data[0]).toBeInstanceOf(Array);
      expect(parsed.data[0].length).toBe(2);
      expect(parsed.data[0][0].title).toBe("scratchpad-think");
      expect(parsed.data[0][1].title).toBe("Real Search");
    });
  });

  describe("stringify method", () => {
    it("should stringify parsed messages", () => {
      const input: WsParsedMessage = {
        messageCode: 421,
        event: "list_user_collections",
        data: [{ version: "2.9", source: "default", limit: 50, offset: 0 }],
      };
      expect(WsMessageParser.stringify(input)).toBe(commonFormatMessage);
    });

    it("should return string messages as-is", () => {
      expect(WsMessageParser.stringify(pingMessages[0])).toBe(pingMessages[0]);
      expect(WsMessageParser.stringify(pongMessages[0])).toBe(pongMessages[0]);
    });

    it("should handle messages with no event", () => {
      const input: WsParsedMessage = {
        messageCode: 433,
        event: "",
        data: [{ remaining: 50 }],
      };
      expect(WsMessageParser.stringify(input)).toBe(opus50RateLimitMessage);
    });
  });
});
