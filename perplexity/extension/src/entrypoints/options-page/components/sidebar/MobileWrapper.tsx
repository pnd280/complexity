import { useLocation } from "react-router-dom";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useOptionsPageSidebarStore } from "@/entrypoints/options-page/components/sidebar/store";
import MyBreadcrumb from "@/entrypoints/options-page/dashboard/pages/plugins/components/MyBreadcrumb";

import LuPanelLeftOpen from "~icons/lucide/panel-left-open";

export default function MobileSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navItems = useOptionsPageSidebarStore((store) => store.navItems);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <Sheet open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
      <div className="x:fixed x:top-0 x:left-0 x:z-10 x:flex x:size-max x:w-full x:cursor-pointer x:items-start x:gap-4 x:bg-background x:p-4">
        <SheetTrigger asChild>
          <LuPanelLeftOpen className="x:my-auto x:size-5.5 x:text-muted-foreground" />
        </SheetTrigger>
        <MyBreadcrumb navItems={navItems} />
      </div>
      <SheetContent side="left" className="x:h-full x:p-0">
        {children}
      </SheetContent>
    </Sheet>
  );
}
