import { describe, it, expect } from "vitest";
import dedent from "dedent";
import vitePluginTailwindCustomPrefixes from "./vite-plugin-tailwind-custom-prefixes";

describe("vite-plugin-tailwind-custom-prefixes", () => {
  const plugin = vitePluginTailwindCustomPrefixes();

  const transformCss = async (css: string): Promise<string> => {
    if (!plugin.transform || typeof plugin.transform !== "function") {
      throw new Error("Plugin transform function not found");
    }

    const result = await plugin.transform.call(null as any, css, "test.css");

    if (typeof result === "object" && result !== null && "code" in result) {
      return result.code ?? css;
    }
    return css;
  };

  it("should prefix basic keyframes", async () => {
    const input = dedent`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;

    const output = await transformCss(input);
    expect(output).toContain("@keyframes x-spin");
    expect(output).not.toContain("@keyframes spin {");
  });

  it("should not double-prefix already prefixed keyframes", async () => {
    const input = dedent`
      @keyframes x-fade {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;

    const output = await transformCss(input);
    expect(output).toContain("@keyframes x-fade");
    expect(output).not.toContain("@keyframes x-x-fade");
  });

  it("should prefix animation property values", async () => {
    const input = dedent`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .test {
        animation: spin 2s linear infinite;
      }
    `;

    const output = await transformCss(input);
    expect(output).toContain("animation: x-spin 2s linear infinite");
  });

  it("should prefix animation-name property values", async () => {
    const input = dedent`
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }

      .test {
        animation-name: bounce;
      }
    `;

    const output = await transformCss(input);
    expect(output).toContain("animation-name: x-bounce");
  });

  it("should handle multiple animations", async () => {
    const input = dedent`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes fade {
        from { opacity: 1; }
        to { opacity: 0; }
      }

      .test {
        animation: spin 1s, fade 2s;
      }
    `;

    const output = await transformCss(input);
    expect(output).toContain("animation: x-spin 1s, x-fade 2s");
  });

  it("should prefix CSS custom properties with animation values", async () => {
    const input = dedent`
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .test {
        --my-animation: pulse 2s ease-in-out;
      }
    `;

    const output = await transformCss(input);
    expect(output).toContain("--my-animation: x-pulse 2s ease-in-out");
  });

  it("should not prefix CSS custom properties without animation keywords", async () => {
    const input = dedent`
      @keyframes test {
        from { opacity: 1; }
        to { opacity: 0; }
      }

      .test {
        --random-prop: test;
      }
    `;

    const output = await transformCss(input);

    expect(output).toContain("--random-prop: test");
    expect(output).not.toContain("--random-prop: x-test");
  });

  it("should replace Tailwind CSS variables", async () => {
    const input = dedent`
      .test {
        color: var(--tw-text-opacity);
        --tw-bg-opacity: 1;
        background: rgba(0, 0, 0, var(--tw-bg-opacity));
      }
    `;

    const output = await transformCss(input);
    expect(output).toContain("var(--x-text-opacity)");
    expect(output).toContain("--x-bg-opacity: 1");
    expect(output).toContain("var(--x-bg-opacity)");
    expect(output).not.toContain("--tw-");
  });

  it("should handle @property syntax for Tailwind CSS variables", async () => {
    const input = dedent`
      @property --tw-color {
        syntax: '<color>';
        initial-value: #000000;
        inherits: false;
      }

      @property --tw-size {
        syntax: '<length>';
        initial-value: 0px;
        inherits: true;
      }

      .test {
        color: var(--tw-color);
        width: var(--tw-size);
      }
    `;

    const output = await transformCss(input);
    expect(output).toContain("@property --x-color");
    expect(output).toContain("@property --x-size");
    expect(output).toContain("var(--x-color)");
    expect(output).toContain("var(--x-size)");
    expect(output).not.toContain("--tw-");
  });

  it("should not modify var() references to keyframes", async () => {
    const input = dedent`
      @keyframes custom {
        from { opacity: 1; }
        to { opacity: 0; }
      }

      .test {
        animation: var(--custom-animation);
        animation-name: var(--animation-name);
      }
    `;

    const output = await transformCss(input);
    expect(output).toContain("animation: var(--custom-animation)");
    expect(output).toContain("animation-name: var(--animation-name)");
  });

  it("should handle complex real-world CSS", async () => {
    const input = dedent`
      @keyframes slideIn {
        from {
          transform: translateX(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes x-existing {
        0% { transform: scale(1); }
        100% { transform: scale(1.1); }
      }

      .component {
        animation: slideIn 0.3s ease-out;
        --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        --custom-animation: slideIn 2s linear infinite;
      }

      .another {
        animation-name: slideIn;
        animation: slideIn 1s, x-existing 2s;
      }
    `;

    const output = await transformCss(input);

    expect(output).toContain("@keyframes x-slideIn");
    expect(output).toContain("@keyframes x-existing");
    expect(output).not.toContain("@keyframes x-x-existing");

    expect(output).toContain("animation: x-slideIn 0.3s ease-out");
    expect(output).toContain("animation-name: x-slideIn");
    expect(output).toContain("animation: x-slideIn 1s, x-existing 2s");

    expect(output).toContain("--x-shadow:");
    expect(output).toContain(
      "--custom-animation: x-slideIn 2s linear infinite",
    );
  });
});
