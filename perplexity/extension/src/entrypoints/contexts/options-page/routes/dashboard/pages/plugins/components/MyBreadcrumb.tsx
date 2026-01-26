import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { NavItem } from "@/entrypoints/contexts/options-page/components/sidebar/nav-items";

type BreadcrumbItem = {
  label: string;
  path: string;
};

function getBreadcrumbItems(
  pathname: string,
  navItems: NavItem[],
): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment) => {
    const navItem = navItems.find((item) => item.path.slice(1) === segment);
    return {
      label:
        navItem?.label ??
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      path: segment,
    };
  });
}

type BreadcrumbProps = {
  navItems: NavItem[];
};

export default function MyBreadcrumb({ navItems }: BreadcrumbProps) {
  const location = useLocation();
  const breadcrumbItems = getBreadcrumbItems(location.pathname, navItems);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#/" className="x:flex x:items-center">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItems.map((item, index) => {
          const link = breadcrumbItems
            .slice(0, index + 1)
            .map((item) => item.path)
            .join("/");

          return (
            <Fragment key={item.path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === breadcrumbItems.length - 1 ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={link}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
