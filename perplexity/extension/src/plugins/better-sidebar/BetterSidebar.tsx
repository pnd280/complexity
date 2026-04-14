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
import { useViewport } from "@/hooks/useViewport";
import useHookMobileTrigger from "@/plugins/better-sidebar/hooks/useHookMobileTrigger";
import {
  betterSidebarStore,
  useBetterSidebarStore,
} from "@/plugins/better-sidebar/store";
import usePortalContainer from "@/plugins/better-sidebar/usePortalContainer";

import LuPanelLeftClose from "~icons/lucide/panel-left-close";
import LuPanelLeftOpen from "~icons/lucide/panel-left-open";
import TablerCalendar from "~icons/tabler/calendar";
import TablerDots from "~icons/tabler/dots";
import TablerHome from "~icons/tabler/home";
import TablerInbox from "~icons/tabler/inbox";
import TablerMenu from "~icons/tabler/menu-2";
import TablerPlus from "~icons/tabler/plus";
import TablerSearch from "~icons/tabler/search";
import TablerSettings from "~icons/tabler/settings";

const items = [
  {
    title: "Home",
    url: "#",
    icon: TablerHome,
  },
  {
    title: "Inbox",
    url: "#",
    icon: TablerInbox,
  },
  {
    title: "Calendar Calendar Calendar Calendar Calendar",
    url: "#",
    icon: TablerCalendar,
  },
  {
    title: "Search",
    url: "#",
    icon: TablerSearch,
  },
  {
    title: "Settings",
    url: "#",
    icon: TablerSettings,
  },
];

export function BetterSidebar() {
  const portalContainer = usePortalContainer();
  const isMobile = useViewport((store) => store.isMobile);
  const open = useBetterSidebarStore((store) => store.open);

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
                <TablerMenu className="x:size-4.5" />
              ) : (
                <LuPanelLeftClose className="x:size-4.5" />
              )}
            </SidebarTrigger>
            <div className="x:flex x:items-center">
              <Button size="icon" variant="ghost">
                <TablerSearch className="x:size-4.5" />
              </Button>
              <Button size="icon" variant="ghost">
                <TablerPlus className="x:size-4.5" />
              </Button>
            </div>
          </SidebarHeader>
          <SidebarContent className={cn("custom-scrollbar")}>
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
                        <TablerDots />
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
                        <TablerDots />
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
                        <TablerDots />
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
                        <TablerDots />
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
                        <TablerDots />
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
                        <TablerDots />
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
        "x:invisible x:fixed x:inset-2 x:left-0 x:z-10 x:h-max x:w-max x:rounded-xl x:rounded-tl-none x:rounded-bl-none x:border x:border-l-0 x:border-border/50 x:bg-secondary x:p-3 x:opacity-0 x:transition-all x:hover:bg-secondary x:lg:rounded-bl-none",
        {
          "x:visible x:opacity-100": !open,
        },
      )}
    >
      <LuPanelLeftOpen className="x:size-4.5" />
    </SidebarTrigger>
  );
}
