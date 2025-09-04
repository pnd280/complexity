import type { ComponentProps } from "react";
import { LuExternalLink, LuChevronDown, LuChevronRight } from "react-icons/lu";
import { NavLink, useMatch } from "react-router-dom";

import SponsorDialogWrapper from "@/components/SponsorDialogWrapper";
import CometCompatibility from "@/entrypoints/options-page/components/CometCompatibility";
import { type NavItem } from "@/entrypoints/options-page/components/sidebar/nav-items";
import { useOptionsPageSidebarStore } from "@/entrypoints/options-page/components/sidebar/store";
import Version from "@/entrypoints/options-page/components/sidebar/Version";
import SidebarUpdateAnnouncer from "@/entrypoints/options-page/components/SidebarUpdateAnnouncer";

const NavItemComponent = ({
  item,
  navItemProps,
}: {
  item: NavItem;
  navItemProps?: ComponentProps<"a">;
}) => {
  const { icon: Icon, label, path, children, expanded: defaultExpanded } = item;
  const [expanded, setExpanded] = useState(defaultExpanded || false);
  const hasChildren = children && children.length > 0;

  const isActiveEnd = useMatch({
    path: path,
    end: true,
  });

  return (
    <div className="x:flex x:flex-col">
      <div className="x:flex x:w-full">
        <NavLink
          to={path}
          {...navItemProps}
          data-active-end={isActiveEnd != null}
          className={({ isActive }) =>
            cn(
              "x:mb-1 x:flex x:flex-1 x:items-center x:rounded-xl x:p-2 x:px-4 x:text-sm x:font-medium x:transition-all x:active:scale-95",
              {
                "x:bg-primary-foreground x:text-primary":
                  isActive && isActiveEnd,
                "x:text-muted-foreground x:hover:text-foreground": !isActive,
              },
              navItemProps?.className,
            )
          }
        >
          {Icon != null && <Icon className="x:mr-2 x:size-4" />}
          <span>{label}</span>
          {hasChildren && (
            <button
              className="x:ml-auto x:text-muted-foreground x:hover:text-foreground"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? (
                <LuChevronDown className="x:size-4" />
              ) : (
                <LuChevronRight className="x:size-4" />
              )}
            </button>
          )}
        </NavLink>
      </div>
      {hasChildren && expanded && (
        <div className="x:mb-2 x:ml-6 x:border-l x:border-border/50">
          {children.map((child) => (
            <NavItemComponent
              key={child.path}
              item={child}
              navItemProps={{
                className:
                  "x:[&>span]:text-sm x:font-normal x:px-2 x:ml-2 x:py-1 x:bg-transparent x:data-[active-end=true]:text-foreground",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar() {
  const navItems = useOptionsPageSidebarStore((store) => store.navItems);

  return (
    <div className="x:sticky x:top-0 x:flex x:h-full x:flex-col x:justify-between x:md:h-screen">
      <div className="x:overflow-y-auto x:p-4 x:px-2">
        <Version />
        {navItems.map((item) => (
          <NavItemComponent key={item.path} item={item} />
        ))}
      </div>

      <div className="x:sticky x:bottom-0 x:z-10 x:flex x:shrink-0 x:flex-col x:gap-4 x:bg-background x:p-4">
        <SidebarUpdateAnnouncer />

        <CometCompatibility />

        <SponsorDialogWrapper>
          <div className="x:group x:relative x:w-full x:cursor-pointer x:rounded-xl x:border x:border-border/50 x:bg-secondary x:p-4 x:text-sm x:font-medium x:shadow-lg x:transition-all x:hover:scale-105 x:hover:border-primary x:hover:bg-primary/10 x:md:text-balance">
            <Trans
              tKey="common.sidebar.supporterMessage"
              components={[
                <span
                  key="sidebar.supporterMessage"
                  className="x:font-medium x:text-primary"
                />,
              ]}
            />
            <LuExternalLink className="x:absolute x:top-2 x:right-2 x:size-3.5 x:text-muted x:group-hover:text-primary" />
          </div>
        </SponsorDialogWrapper>
      </div>
    </div>
  );
}
