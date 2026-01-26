import { Slider as ArkSlider } from "@ark-ui/react/slider";
import type { ComponentProps } from "react";

export type SliderProps = ArkSlider.RootProps;

export const SliderContext = ArkSlider.Context;

export const Slider = ArkSlider.Root;

export function SliderLabel({ className, ...props }: ArkSlider.LabelProps) {
  return (
    <ArkSlider.Label
      className={cn(
        "x:text-sm x:leading-none x:font-medium x:peer-disabled:cursor-not-allowed x:peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

export function SliderValueText({
  className,
  ...props
}: ArkSlider.ValueTextProps) {
  return (
    <ArkSlider.ValueText
      className={cn("x:text-sm x:text-muted-foreground", className)}
      {...props}
    />
  );
}

export function SliderControl({ className, ...props }: ArkSlider.ControlProps) {
  return (
    <ArkSlider.Control
      className={cn("x:relative x:flex x:w-full x:touch-none", className)}
      {...props}
    />
  );
}

export function SliderTrack({ className, ...props }: ArkSlider.TrackProps) {
  return (
    <ArkSlider.Track
      className={cn(
        "x:relative x:h-2 x:w-full x:grow x:rounded-full x:bg-secondary",
        className,
      )}
      {...props}
    />
  );
}

export function SliderRange({ className, ...props }: ArkSlider.RangeProps) {
  return (
    <ArkSlider.Range
      className={cn("x:absolute x:h-full x:bg-primary", className)}
      {...props}
    />
  );
}

export function SliderThumb({
  className,
  indicatorProps,
  showValueIndicator,
  ...props
}: ArkSlider.ThumbProps & {
  showValueIndicator?: boolean;
  indicatorProps?: ComponentProps<"div">;
}) {
  return (
    <ArkSlider.Thumb
      className={cn(
        "x:relative x:-mt-1.5 x:block x:h-5 x:w-5 x:rounded-full x:border-2 x:border-primary x:bg-background x:ring-offset-background x:transition-colors x:select-none x:focus-visible:ring-2 x:focus-visible:ring-ring x:focus-visible:ring-offset-2 x:focus-visible:outline-none x:disabled:pointer-events-none x:disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {showValueIndicator && (
        <div
          {...indicatorProps}
          className={cn(
            "x:absolute x:-top-7 x:left-1/2 x:-translate-x-1/2 x:-translate-y-1/2 x:rounded-md x:border x:border-border/50 x:bg-primary x:px-2 x:py-1",
            indicatorProps?.className,
          )}
        >
          <ArkSlider.ValueText className="x:text-xs x:text-primary-foreground" />
          <div className="x:absolute x:-bottom-1 x:left-1/2 x:-translate-x-1/2 x:border-4 x:border-transparent x:border-t-primary" />
        </div>
      )}
      <ArkSlider.HiddenInput />
    </ArkSlider.Thumb>
  );
}

export function SliderMarkerGroup({
  className,
  ...props
}: ArkSlider.MarkerGroupProps) {
  return (
    <ArkSlider.MarkerGroup
      className={cn("x:relative x:mt-2 x:flex x:w-full", className)}
      {...props}
    />
  );
}

export function SliderMarker({ className, ...props }: ArkSlider.MarkerProps) {
  return (
    <ArkSlider.Marker
      className={cn(
        "x:text-xs x:text-muted-foreground x:before:absolute x:before:-top-2 x:before:h-2 x:before:w-0.5 x:before:bg-muted-foreground/50",
        className,
      )}
      {...props}
    />
  );
}
