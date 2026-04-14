import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import LoadingOverlay from "@/components/LoadingOverlay";
import CometCompatibilityPsa from "@/entrypoints/contexts/options-page/components/CometCompatibilityPsa";
import Psa from "@/entrypoints/contexts/options-page/components/Psa";
import DesktopSidebarWrapper from "@/entrypoints/contexts/options-page/components/sidebar/DesktopWrapper";
import MobileSidebarWrapper from "@/entrypoints/contexts/options-page/components/sidebar/MobileWrapper";
import Sidebar from "@/entrypoints/contexts/options-page/components/sidebar/Sidebar";
import { useViewport } from "@/hooks/useViewport";

export function Dashboard() {
  const { isMobile } = useViewport();
  const SidebarWrapper = isMobile
    ? MobileSidebarWrapper
    : DesktopSidebarWrapper;

  return (
    <div className="x:flex x:min-h-screen x:bg-background">
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>

      <main className="x:w-full">
        <CometCompatibilityPsa />
        <Psa />
        <div className="x:mx-auto x:mt-11 x:min-h-dvh x:w-full x:max-w-[1800px] x:px-4 x:py-4 x:md:mt-0">
          <Suspense fallback={<LoadingOverlay />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
