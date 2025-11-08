import { useCommandMenuStore } from "@/plugins/command-menu/store";

type CommandItemGuardProps = {
  children: React.ReactNode;
  eager?: boolean;
  hideOnDirty?: boolean;
  show?: boolean;
};

function CommandItemGuard({
  children,
  eager = true,
  show = true,
  hideOnDirty = false,
}: CommandItemGuardProps) {
  const isDirty = useCommandMenuStore(
    (store) => store.states.searchValue.length > 0,
  );

  if (!show) return null;
  if (!eager && !isDirty) return null;
  if (hideOnDirty && isDirty) return null;
  return children;
}

export default memo(CommandItemGuard);
