import { Portal as ArkPortal } from "@ark-ui/react/portal";
import type React from "react";

type PortalProps = {
  children: React.ReactNode;
  container?: HTMLElement | null;
};

export function Portal({ children, container }: PortalProps) {
  if (container !== undefined && !document.contains(container)) return null;

  return (
    <ArkPortal
      container={{
        current: container ?? $("#complexity-root")[0] ?? $("#app")[0]!,
      }}
    >
      {children}
    </ArkPortal>
  );
}
