import type { ComponentType, SVGProps } from "react";

export type CodeBlockLocation = {
  messageBlockIndex: number;
  codeBlockIndex: number;
};

export type ArtifactBlock = {
  Icon: ComponentType<SVGProps<SVGElement>>;
  count: number;
  title: string;
  description: string;
  onClick: () => void;
  isInFlight: boolean;
  location: CodeBlockLocation[];
};

export interface BlocksSlice {
  artifactBlocks: Record<string, ArtifactBlock>;
}
