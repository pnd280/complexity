import { ReactNode } from "react";
import { SiHtml5, SiMermaid } from "react-icons/si";

import HtmlCanvas from "@/content-script/components/Canvas/HtmlCanvas";
import MermaidCanvas from "@/content-script/components/Canvas/MermaidCanvas";
import { CanvasLang } from "@/utils/Canvas";

type CanvasComponents = Record<CanvasLang, ReactNode>;

export const canvasComponents: CanvasComponents = {
  mermaid: <MermaidCanvas />,
  html: <HtmlCanvas />,
};

type CanvasPlaceholders = Record<
  CanvasLang,
  {
    title: string;
    description: string;
    icon: ReactNode;
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
};
