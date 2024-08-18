import { describe, it, expect } from "vitest";

import {
  compareVersions,
  escapeHtmlTags,
  isValidVersionString,
  whereAmI,
} from "@/utils/utils";

describe("isValidVersionString", () => {
  it("should return true for valid version strings", () => {
    expect(isValidVersionString("1.0.0")).toBe(true);
    expect(isValidVersionString("0.0.0.1")).toBe(true);
  });

  it("should return false for invalid version strings", () => {
    expect(isValidVersionString("1")).toBe(false);
    expect(isValidVersionString("0.1.")).toBe(false);
    expect(isValidVersionString("1.0.0a")).toBe(false);
  });
});

describe("compareVersions", () => {
  it("should handle various comparison scenarios", () => {
    expect(compareVersions("1.2.3", "1.2.3")).toBe(0);
    expect(compareVersions("0.0.2", "0.0.1")).toBe(1);
    expect(compareVersions("0.9.9", "1.0.0")).toBe(-1);
    expect(compareVersions("1.0", "1.0.0")).toBe(0);
    expect(compareVersions("0.1", "0.1.1")).toBe(-1);
    expect(compareVersions("1.2.3.4", "1.2.3.5")).toBe(-1);
    expect(compareVersions("0.0.0.0.1", "0.0.0.0.0")).toBe(1);
  });

  it("should throw an error for invalid version strings", () => {
    expect(() => compareVersions("1.a.0", "0.1.0")).toThrow(
      "Invalid version string",
    );
  });
});

describe("whereAmI", () => {
  it('should return "collection" for collection URLs', () => {
    expect(whereAmI("https://www.perplexity.ai/collections/example")).toBe(
      "collection",
    );
  });

  it('should return "thread" for thread URLs', () => {
    expect(whereAmI("https://www.perplexity.ai/search/example-query")).toBe(
      "thread",
    );
  });

  it('should return "page" for Pages URLs', () => {
    expect(whereAmI("https://www.perplexity.ai/page/example-page")).toBe(
      "page",
    );
  });

  it('should return "library" for library URLs', () => {
    expect(whereAmI("https://www.perplexity.ai/library")).toBe("library");
  });

  it('should return "home" for the home URL', () => {
    expect(whereAmI("https://www.perplexity.ai/")).toBe("home");
  });

  it('should return "unknown" for unrecognized paths on perplexity.ai', () => {
    expect(whereAmI("https://www.perplexity.ai/settings")).toBe("unknown");
  });

  it('should return "unknown" for non-perplexity.ai URLs', () => {
    expect(whereAmI("https://example.com")).toBe("unknown");
  });
});

describe("escapeHtmlTags", () => {
  it("should replace < with &lt;", () => {
    expect(escapeHtmlTags("<div>")).toBe("&lt;div&gt;");
  });

  it("should replace > with &gt;", () => {
    expect(escapeHtmlTags("</div>")).toBe("&lt;/div&gt;");
  });

  it("should replace both < and > in a string", () => {
    expect(escapeHtmlTags("<p>Hello, world!</p>")).toBe(
      "&lt;p&gt;Hello, world!&lt;/p&gt;",
    );
  });

  it("should not modify strings without < or >", () => {
    expect(escapeHtmlTags("Hello, world!")).toBe("Hello, world!");
  });

  it("should handle empty strings", () => {
    expect(escapeHtmlTags("")).toBe("");
  });

  it("should handle strings with multiple occurrences of < and >", () => {
    expect(escapeHtmlTags("<<div>>")).toBe("&lt;&lt;div&gt;&gt;");
  });
});
