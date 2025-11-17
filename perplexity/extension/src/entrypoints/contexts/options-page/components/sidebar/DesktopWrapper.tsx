export default function DesktopSidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="x:w-max x:max-w-[250px] x:border-r x:border-border/50">
      {children}
    </div>
  );
}
