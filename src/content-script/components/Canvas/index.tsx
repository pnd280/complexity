import { ReactNode } from "react";
import { FaBrain } from "react-icons/fa";
import { SiHtml5, SiMermaid } from "react-icons/si";

import HtmlCanvas from "@/content-script/components/Canvas/HtmlCanvas";
import MarkdownCanvas from "@/content-script/components/Canvas/MarkdownCanvas";
import MermaidCanvas from "@/content-script/components/Canvas/MermaidCanvas";
import { CanvasLang } from "@/utils/Canvas";

type CanvasComponents = Record<CanvasLang, ReactNode>;

export const canvasComponents: CanvasComponents = {
  mermaid: <MermaidCanvas />,
  html: <HtmlCanvas />,
  scratchpad: <MarkdownCanvas />,
};

type CanvasPlaceholders = Record<
  CanvasLang,
  {
    title: string;
    description: string;
    loadingPlaceholder?: string;
    icon: ReactNode;
    maxWidth?: number;
  }
>;

export const canvasPlaceholders: CanvasPlaceholders = {
  mermaid: {
    title: "Mermaid",
    description: "Click to open in canvas",
    icon: (
      <SiMermaid className="tw-size-6 tw-text-muted-foreground tw-transition-colors" />
    ),
  },
  html: {
    title: "HTML",
    description: "Click to open in canvas",
    icon: (
      <SiHtml5 className="tw-size-6 tw-text-muted-foreground tw-transition-colors" />
    ),
  },
  scratchpad: {
    title: "Scratchpad",
    description: "Click to see the LLM's reasoning",
    loadingPlaceholder: "Thinking...",
    icon: (
      <FaBrain className="tw-size-6 tw-text-muted-foreground tw-transition-colors" />
    ),
  },
};
