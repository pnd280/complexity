import { ReactNode } from 'react';
import { SiHtml5, SiMermaid } from 'react-icons/si';

import { CanvasLang } from '@/utils/Canvas';

import HTMLCanvas from './HTMLCanvas';
import MermaidCanvas from './MermaidCanvas';

type CanvasComponents = Record<CanvasLang, ReactNode>;

export const canvasComponents: CanvasComponents = {
  mermaid: <MermaidCanvas />,
  html: <HTMLCanvas />,
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
    title: 'Mermaid',
    description: 'Click to open in canvas',
    icon: (
      <SiMermaid className="tw-size-6 tw-text-muted-foreground tw-transition-colors" />
    ),
  },
  html: {
    title: 'HTML',
    description: 'Click to open in canvas',
    icon: (
      <SiHtml5 className="tw-size-6 tw-text-muted-foreground tw-transition-colors" />
    ),
  },
};
