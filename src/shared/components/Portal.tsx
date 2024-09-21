import { Portal as ArkPortal } from "@ark-ui/react";
import React from "react";

type PortalProps = {
  children: React.ReactNode;
  container?: HTMLElement;
};

export default function Portal({ children, container }: PortalProps) {
  return (
    <ArkPortal
      container={{
        current: container ?? $("#complexity-root")[0],
      }}
    >
      {children}
    </ArkPortal>
  );
}
