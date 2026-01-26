import { FloatingPanel as ArkFloatingPanel } from "@ark-ui/react/floating-panel";
import { Slot } from "@radix-ui/react-slot";
import type { ComponentPropsWithoutRef } from "react";

import { Portal } from "@/components/ui/portal";

import TablerArrowDownLeft from "~icons/tabler/arrow-down-left";
import TablerMaximize from "~icons/tabler/maximize";
import TablerMinus from "~icons/tabler/minus";
import TablerX from "~icons/tabler/x";

const resizeTriggerStyles = {
  base: "x:absolute x:bg-transparent x:touch-action-none",
  n: "x:top-0 x:left-0 x:right-0 x:h-2 x:cursor-ns-resize",
  e: "x:top-0 x:right-0 x:bottom-0 x:w-2 x:cursor-ew-resize",
  s: "x:bottom-0 x:left-0 x:right-0 x:h-2 x:cursor-ns-resize",
  w: "x:top-0 x:left-0 x:bottom-0 x:w-2 x:cursor-ew-resize",
  ne: "x:top-0 x:right-0 x:size-3 x:cursor-ne-resize",
  se: "x:bottom-0 x:right-0 x:size-3 x:cursor-se-resize",
  sw: "x:bottom-0 x:left-0 x:size-3 x:cursor-sw-resize",
  nw: "x:top-0 x:left-0 x:size-3 x:cursor-nw-resize",
};

export const FloatingPanelRootProvider = ArkFloatingPanel.RootProvider;

type FloatingPanelProps = ComponentPropsWithoutRef<
  typeof ArkFloatingPanel.Root
>;

export function FloatingPanel({ children, ...props }: FloatingPanelProps) {
  return <ArkFloatingPanel.Root {...props}>{children}</ArkFloatingPanel.Root>;
}

type FloatingPanelTriggerProps = ComponentPropsWithoutRef<
  typeof ArkFloatingPanel.Trigger
>;

export function FloatingPanelTrigger({ ...props }: FloatingPanelTriggerProps) {
  return <ArkFloatingPanel.Trigger {...props} />;
}

type FloatingPanelContentProps = ComponentPropsWithoutRef<
  typeof ArkFloatingPanel.Content
> & {
  portal?: boolean;
};

export function FloatingPanelContent({
  className,
  portal,
  ...props
}: FloatingPanelContentProps) {
  const Comp = portal ? Portal : Slot;

  return (
    <Comp>
      <ArkFloatingPanel.Positioner className="x:z-50">
        <ArkFloatingPanel.Content
          className={cn(
            "x:relative x:rounded-lg x:border x:bg-background x:shadow-md x:outline-none",
            className,
          )}
          {...props}
        />
      </ArkFloatingPanel.Positioner>
    </Comp>
  );
}

type FloatingPanelHeaderProps = ComponentPropsWithoutRef<
  typeof ArkFloatingPanel.Header
>;

export function FloatingPanelHeader({
  className,
  ...props
}: FloatingPanelHeaderProps) {
  return (
    <ArkFloatingPanel.Header
      className={cn(
        "x:flex x:cursor-move x:items-center x:justify-between x:rounded-t-lg x:border-b x:bg-secondary x:p-2 x:px-4",
        className,
      )}
      {...props}
    />
  );
}

type FloatingPanelDragTriggerProps = ComponentPropsWithoutRef<
  typeof ArkFloatingPanel.DragTrigger
>;

export function FloatingPanelDragTrigger({
  className,
  ...props
}: FloatingPanelDragTriggerProps) {
  return (
    <ArkFloatingPanel.DragTrigger
      className={cn("x:cursor-move", className)}
      {...props}
    />
  );
}

type FloatingPanelTitleProps = ComponentPropsWithoutRef<
  typeof ArkFloatingPanel.Title
>;

export function FloatingPanelTitle({
  className,
  ...props
}: FloatingPanelTitleProps) {
  return (
    <ArkFloatingPanel.Title
      className={cn("x:text-sm x:font-semibold", className)}
      {...props}
    />
  );
}

type FloatingPanelControlProps = ComponentPropsWithoutRef<
  typeof ArkFloatingPanel.Control
>;

export function FloatingPanelControl({
  className,
  ...props
}: FloatingPanelControlProps) {
  return (
    <ArkFloatingPanel.Control
      className={cn("x:flex x:items-center x:gap-1", className)}
      {...props}
    />
  );
}

type FloatingPanelBodyProps = ComponentPropsWithoutRef<
  typeof ArkFloatingPanel.Body
>;

export function FloatingPanelBody({
  className,
  ...props
}: FloatingPanelBodyProps) {
  return (
    <ArkFloatingPanel.Body
      className={cn("x:overflow-auto x:p-4", className)}
      {...props}
    />
  );
}

type FloatingPanelStageTriggerProps = ComponentPropsWithoutRef<
  typeof ArkFloatingPanel.StageTrigger
>;

export function FloatingPanelStageTrigger({
  className,
  stage,
  children,
  ...props
}: FloatingPanelStageTriggerProps) {
  return (
    <ArkFloatingPanel.StageTrigger
      stage={stage}
      className={cn(
        "x:box-content x:flex x:size-4 x:items-center x:justify-center x:rounded-lg x:p-1 x:text-sm x:transition-all x:hover:bg-muted",
        className,
      )}
      {...props}
    >
      {children != null
        ? children
        : stageIcons[stage as keyof typeof stageIcons]}
    </ArkFloatingPanel.StageTrigger>
  );
}

type FloatingPanelCloseTriggerProps = ComponentPropsWithoutRef<
  typeof ArkFloatingPanel.CloseTrigger
>;

export function FloatingPanelCloseTrigger({
  className,
  children,
  ...props
}: FloatingPanelCloseTriggerProps) {
  return (
    <ArkFloatingPanel.CloseTrigger
      className={cn(
        "x:box-content x:flex x:size-4 x:items-center x:justify-center x:rounded-lg x:p-1 x:text-sm x:transition-all x:hover:bg-muted",
        className,
      )}
      {...props}
    >
      {children != null ? children : <TablerX className="x:size-4" />}
    </ArkFloatingPanel.CloseTrigger>
  );
}

type FloatingPanelResizeTriggerProps = ComponentPropsWithoutRef<
  typeof ArkFloatingPanel.ResizeTrigger
>;

export function FloatingPanelResizeTrigger({
  className,
  axis,
  ...props
}: FloatingPanelResizeTriggerProps) {
  return (
    <ArkFloatingPanel.ResizeTrigger
      axis={axis}
      className={cn(
        resizeTriggerStyles.base,
        resizeTriggerStyles[axis as keyof typeof resizeTriggerStyles],
        className,
      )}
      {...props}
    />
  );
}

const stageIcons = {
  minimized: <TablerMinus className="x:size-4" />,
  maximized: <TablerMaximize className="x:size-4" />,
  default: <TablerArrowDownLeft className="x:size-4" />,
};
