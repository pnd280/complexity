import { fromUint8Array } from "js-base64";
import type { Mermaid, MermaidConfig } from "mermaid";
import pako from "pako";
import svgPanZoom from "svg-pan-zoom";

import { getCurrentColorScheme } from "@/utils/dom-utils/generics";
import { injectMainWorldScriptBlock } from "@/utils/dom-utils/generics";
import packageJson from "~/package.json";

export const mainWorldProxyServiceName =
  "plugin:thread:artifacts:mermaidRendererService";

export class MermaidRendererServiceImpl {
  private static instance: MermaidRendererServiceImpl | null = null;
  private importPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance() {
    if (!MermaidRendererServiceImpl.instance) {
      MermaidRendererServiceImpl.instance = new MermaidRendererServiceImpl();
    }
    return MermaidRendererServiceImpl.instance;
  }

  initialize() {
    $(() => this.importMermaid());
  }

  private async importMermaid(): Promise<void> {
    if (!this.importPromise) {
      const scriptContent = `
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@${packageJson.devDependencies["mermaid"]}/dist/mermaid.esm.min.mjs';

        window.mermaid = mermaid;
      `;

      this.importPromise = injectMainWorldScriptBlock({
        scriptContent,
        waitForExecution: true,
      }).catch((error) => {
        console.error("Failed to import Mermaid:", error);
        throw error;
      });
    }

    return this.importPromise;
  }

  isInitialized() {
    return this.importPromise?.then(() => true).catch(() => false);
  }

  async render(
    selector: string,
  ): Promise<{ success: boolean; error?: string }> {
    const $target = $(selector);

    if ($target.length === 0) {
      console.warn("No elements found for rendering Mermaid");
      return {
        success: false,
        error: "No elements found for rendering Mermaid",
      };
    }

    const isRendered = $target.find("svg").length > 0;

    if (isRendered) {
      return {
        success: true,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mermaid = (window as any).mermaid as Mermaid;

    try {
      await this.waitForInitialization();

      const isDarkTheme = getCurrentColorScheme() === "dark";

      const config: MermaidConfig = {
        startOnLoad: false,
        theme: isDarkTheme ? "dark" : "base",
        gitGraph: {
          useMaxWidth: true,
        },
        fontFamily: "var(--pplx-sans)",
      };

      mermaid.initialize(config);

      if (!$target[0])
        return {
          success: false,
          error: "No elements found for rendering Mermaid",
        };

      await mermaid.run({
        nodes: [$target[0]],
      });

      const $svg = $target.find("svg");

      $svg.css({
        width: "100%",
        maxWidth: "100%",
        height: "100%",
      });

      if (!$svg[0])
        return {
          success: false,
          error: "No SVG element found for rendering Mermaid",
        };

      const svgPanZoomInstance = svgPanZoom($svg[0], {
        center: true,
        fit: true,
        contain: true,
        dblClickZoomEnabled: true,
      });

      $target.on("resetZoom", () => {
        svgPanZoomInstance.resetZoom();
      });

      $target.on("resetPan", () => {
        svgPanZoomInstance.resetPan();
      });

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async getPlaygroundUrl(code: string): Promise<string> {
    try {
      await this.waitForInitialization();

      const json = JSON.stringify({
        code,
      });

      const data = new TextEncoder().encode(json);
      const compressed = pako.deflate(data, { level: 9 });
      const encoded = fromUint8Array(compressed, true);

      return `https://mermaidchart.com/play#pako:${encoded}`;
    } catch (e) {
      console.error(
        "[MermaidRendererService] Error getting playground URL:",
        e,
      );
      return "";
    }
  }

  async waitForInitialization() {
    while (!MermaidRendererServiceImpl.getInstance().isInitialized()) {
      await sleep(100);
    }
  }
}

export type MermaidRendererService = MermaidRendererServiceImpl;
