import {
  LuCalendar,
  LuHouse,
  LuSearch,
  LuSettings,
  LuInbox,
  LuEllipsis,
  LuPlus,
  LuMenu,
  LuPanelLeftOpen,
  LuPanelLeftClose,
} from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import useHookMobileTrigger from "@/plugins/better-sidebar/hooks/useHookMobileTrigger";
import {
  betterSidebarStore,
  useBetterSidebarStore,
} from "@/plugins/better-sidebar/store";
import usePortalContainer from "@/plugins/better-sidebar/usePortalContainer";
import { PPLX_SCROLLBAR_CLASSES } from "@/utils/dom-utils/pplx-scrollbar-classes";

const items = [
  {
    title: "Home",
    url: "#",
    icon: LuHouse,
  },
  {
    title: "Inbox",
    url: "#",
    icon: LuInbox,
  },
  {
    title: "Calendar Calendar Calendar Calendar Calendar",
    url: "#",
    icon: LuCalendar,
  },
  {
    title: "Search",
    url: "#",
    icon: LuSearch,
  },
  {
    title: "Settings",
    url: "#",
    icon: LuSettings,
  },
];

export function BetterSidebar() {
  const portalContainer = usePortalContainer();
  const isMobile = useIsMobileStore((state) => state.isMobile);
  const open = useBetterSidebarStore((state) => state.open);

  useHookMobileTrigger();

  return (
    <Portal container={isMobile ? undefined : portalContainer}>
      <SidebarProvider
        open={open}
        onOpenChange={(open) => {
          betterSidebarStore.getState().setOpen(open);
        }}
      >
        {!isMobile && <SidebarFloatingTrigger />}
        <Sidebar className="x:mt-1 x:border-none">
          <SidebarHeader className="x:flex-row x:justify-between">
            <SidebarTrigger className="x:rounded-full x:md:rounded-lg">
              {isMobile ? (
                <LuMenu className="x:size-4.5" />
              ) : (
                <LuPanelLeftClose className="x:size-4.5" />
              )}
            </SidebarTrigger>
            <div className="x:flex x:items-center">
              <Button size="icon" variant="ghost">
                <LuSearch className="x:size-4.5" />
              </Button>
              <Button size="icon" variant="ghost">
                <LuPlus className="x:size-4.5" />
              </Button>
            </div>
          </SidebarHeader>
          <SidebarContent className={cn(PPLX_SCROLLBAR_CLASSES)}>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                      <SidebarMenuAction showOnHover>
                        <LuEllipsis />
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                      <SidebarMenuAction showOnHover>
                        <LuEllipsis />
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                      <SidebarMenuAction showOnHover>
                        <LuEllipsis />
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                      <SidebarMenuAction showOnHover>
                        <LuEllipsis />
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                      <SidebarMenuAction showOnHover>
                        <LuEllipsis />
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                      <SidebarMenuAction showOnHover>
                        <LuEllipsis />
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>Footer</SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    </Portal>
  );
}

function SidebarFloatingTrigger() {
  const { open } = useSidebar();

  return (
    <SidebarTrigger
      id="sidebar-floating-trigger"
      className={cn(
        "x:invisible x:fixed x:inset-2 x:z-10 x:h-max x:w-max x:rounded-xl x:rounded-tl-none x:rounded-bl-none x:border x:border-l-0 x:border-border/50 x:bg-secondary x:p-3 x:opacity-0 x:transition-all x:hover:bg-secondary x:lg:rounded-bl-none",
        {
          "x:visible x:opacity-100": !open,
        },
      )}
    >
      <LuPanelLeftOpen className="x:size-4.5" />
    </SidebarTrigger>
  );
}
