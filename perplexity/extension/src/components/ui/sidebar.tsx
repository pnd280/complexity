/* eslint-disable react-refresh/only-export-components */
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { useHotkeys } from "react-hotkeys-hook";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobileStore } from "@/hooks/is-mobile-store";
import { getPlatform } from "@/hooks/usePlatformDetection";
import { keysToString } from "@/utils/misc/utils";

const SIDEBAR_WIDTH = "264px";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const context = use(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

type SidebarProviderProps = React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobileStore((state) => state.isMobile);

  const [_open, _setOpen] = useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = useCallback(() => {
    setOpen((open) => !open);
  }, [setOpen]);

  useHotkeys(
    keysToString([
      getPlatform() === "mac" ? Key.Meta : Key.Control,
      SIDEBAR_KEYBOARD_SHORTCUT,
    ]),
    () => {
      window.dispatchEvent(new Event("resize"));
      toggleSidebar();
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    },
  );

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, toggleSidebar],
  );

  return (
    <SidebarContext value={contextValue}>
      <div
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "x:group/sidebar-wrapper x:hidden x:min-h-svh x:w-full x:has-data-[variant=inset]:bg-secondary x:md:flex",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext>
  );
}

export function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
} & React.ComponentProps<"div">) {
  const { isMobile, state, open, setOpen } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        className={cn(
          "x:flex x:h-full x:w-(--sidebar-width) x:flex-col x:bg-secondary x:text-background",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={({ open }) => setOpen(open)}>
        <SheetContent
          closeButton={false}
          data-sidebar="sidebar"
          data-mobile="true"
          className="x:w-(--sidebar-width) x:bg-secondary x:p-0 x:text-background x:[&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
          {...props}
        >
          <SheetHeader className="x:sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="x:flex x:h-full x:w-full x:flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="x:group x:peer x:hidden x:text-background x:md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={cn(
          "x:relative x:w-(--sidebar-width) x:bg-transparent x:transition-[width]",
          "x:group-data-[collapsible=offcanvas]:w-0",
          "x:group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "x:group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "x:group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
        )}
      />
      <div
        className={cn(
          "x:fixed x:inset-y-0 x:z-10 x:hidden x:h-svh x:w-(--sidebar-width) x:transition-[left,right,width] x:md:flex",
          side === "left"
            ? "x:left-0 x:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "x:right-0 x:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "x:p-2 x:group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "x:group-data-[collapsible=icon]:w-(--sidebar-width-icon) x:group-data-[side=left]:border-r x:group-data-[side=right]:border-l",
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className="x:flex x:h-full x:w-full x:flex-col x:bg-secondary x:group-data-[variant=floating]:rounded-md x:group-data-[variant=floating]:border x:group-data-[variant=floating]:bg-background x:group-data-[variant=floating]:shadow"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function SidebarTrigger({
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    />
  );
}

export function SidebarRail({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      title="Toggle Sidebar"
      className={cn(
        "sm:flex x:absolute x:inset-y-0 x:z-20 x:hidden x:w-4 x:-translate-x-1/2 x:transition-all x:ease-linear x:group-data-[side=left]:-right-4 x:group-data-[side=right]:left-0 x:after:absolute x:after:inset-y-0 x:after:left-1/2 x:after:w-[2px] x:hover:after:bg-muted",
        "x:in-data-[side=left]:cursor-w-resize x:in-data-[side=right]:cursor-e-resize",
        "x:[[data-side=left][data-state=collapsed]_&]:cursor-e-resize x:[[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "x:group-data-[collapsible=offcanvas]:translate-x-0 x:group-data-[collapsible=offcanvas]:after:left-full x:group-data-[collapsible=offcanvas]:hover:bg-secondary",
        "x:[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "x:[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className,
      )}
      onClick={toggleSidebar}
      {...props}
    />
  );
}

export function SidebarInset({
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      className={cn(
        "x:relative x:flex x:w-full x:flex-1 x:flex-col x:bg-background",
        "x:md:peer-data-[variant=inset]:m-2 x:md:peer-data-[variant=inset]:ml-0 x:md:peer-data-[variant=inset]:rounded-xl x:md:peer-data-[variant=inset]:shadow x:md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-sidebar="input"
      className={cn(
        "x:h-8 x:w-full x:bg-background x:shadow-none x:focus-visible:ring-2 x:focus-visible:ring-primary",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="header"
      className={cn("x:flex x:flex-col x:gap-2 x:p-2", className)}
      {...props}
    />
  );
}

export function SidebarFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="footer"
      className={cn("x:flex x:flex-col x:gap-2 x:p-2", className)}
      {...props}
    />
  );
}

export function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-sidebar="separator"
      className={cn("x:mx-2 x:w-auto x:bg-muted", className)}
      {...props}
    />
  );
}

export function SidebarContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="content"
      className={cn(
        "x:flex x:min-h-0 x:flex-1 x:flex-col x:gap-2 x:overflow-auto x:group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="group"
      className={cn(
        "x:relative x:flex x:w-full x:min-w-0 x:flex-col x:p-2",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-sidebar="group-label"
      className={cn(
        "x:flex x:h-8 x:shrink-0 x:items-center x:rounded-lg x:px-2 x:text-xs x:font-medium x:text-muted-foreground x:ring-primary x:transition-[margin,opacity] x:duration-200 x:ease-linear x:outline-none x:focus-visible:ring-2 x:[&>svg]:size-4 x:[&>svg]:shrink-0",
        "x:group-data-[collapsible=icon]:-mt-8 x:group-data-[collapsible=icon]:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-sidebar="group-action"
      className={cn(
        "x:absolute x:top-3.5 x:right-3 x:flex x:aspect-square x:w-5 x:items-center x:justify-center x:rounded-lg x:p-0 x:text-background x:ring-primary x:transition-transform x:outline-none x:hover:bg-secondary x:hover:text-foreground x:focus-visible:ring-2 x:[&>svg]:size-4 x:[&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "x:after:absolute x:after:-inset-2 x:after:md:hidden",
        "x:group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="group-content"
      className={cn("x:w-full x:text-sm", className)}
      {...props}
    />
  );
}

export function SidebarMenu({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-sidebar="menu"
      className={cn("x:flex x:w-full x:min-w-0 x:flex-col x:gap-1", className)}
      {...props}
    />
  );
}

export function SidebarMenuItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-sidebar="menu-item"
      className={cn("x:group/menu-item x:relative", className)}
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  "x:peer/menu-button x:flex x:w-full x:items-center x:gap-2 x:overflow-hidden x:rounded-lg x:text-left x:text-sm x:font-medium x:text-foreground x:ring-primary x:transition-all x:outline-none x:group-has-data-[sidebar=menu-action]/menu-item:pr-8 x:group-data-[collapsible=icon]:size-8! x:group-data-[collapsible=icon]:p-2! x:hover:bg-secondary x:focus-visible:ring-2 x:active:bg-secondary x:active:text-foreground x:disabled:pointer-events-none x:disabled:opacity-50 x:aria-disabled:pointer-events-none x:aria-disabled:opacity-50 x:data-[state=open]:hover:bg-secondary x:data-[state=open]:hover:text-foreground x:[&>span:last-child]:truncate x:[&>svg]:size-4 x:[&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "x:hover:bg-foreground-subtle",
      },
      size: {
        default: "x:p-2 x:text-sm",
        sm: "x:p-1.5 x:text-xs",
        lg: "x:p-3 x:text-base x:group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  className,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  showOnHover?: boolean;
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-sidebar="menu-action"
      className={cn(
        "x:absolute x:top-1.5 x:right-2 x:flex x:aspect-square x:w-5 x:items-center x:justify-center x:rounded-lg x:p-0 x:text-muted-foreground x:ring-primary x:transition-all x:outline-none x:peer-hover/menu-button:text-foreground x:hover:bg-foreground-subtle x:hover:text-foreground x:focus-visible:ring-2 x:[&>svg]:size-4 x:[&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "x:after:absolute x:after:-inset-2 x:after:md:hidden",
        "x:peer-data-[size=default]/menu-button:top-2",
        "x:peer-data-[size=sm]/menu-button:top-1",
        "x:peer-data-[size=lg]/menu-button:top-3.5",
        "x:group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "x:group-focus-within/menu-item:opacity-100 x:group-hover/menu-item:opacity-100 x:peer-data-[active=true]/menu-button:text-foreground x:data-[state=open]:opacity-100 x:md:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="menu-badge"
      className={cn(
        "x:pointer-events-none x:absolute x:right-1 x:flex x:h-5 x:min-w-5 x:items-center x:justify-center x:rounded-lg x:px-1 x:text-xs x:font-medium x:text-background x:tabular-nums x:select-none",
        "x:peer-hover/menu-button:text-foreground x:peer-data-[active=true]/menu-button:text-foreground",
        "x:peer-data-[size=sm]/menu-button:top-1",
        "x:peer-data-[size=default]/menu-button:top-1.5",
        "x:peer-data-[size=lg]/menu-button:top-2.5",
        "x:group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean;
}) {
  // Random width between 50 to 90%.
  const width = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      data-sidebar="menu-skeleton"
      className={cn(
        "x:flex x:h-8 x:items-center x:gap-2 x:rounded-lg x:px-2",
        className,
      )}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="x:size-4 x:rounded-lg"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="x:h-4 x:max-w-(--skeleton-width) x:flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

export function SidebarMenuSub({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-sidebar="menu-sub"
      className={cn(
        "x:ml-3.5 x:flex x:min-w-0 x:translate-x-px x:flex-col x:gap-1 x:border-l x:py-0.5 x:pl-2.5",
        "x:group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}
