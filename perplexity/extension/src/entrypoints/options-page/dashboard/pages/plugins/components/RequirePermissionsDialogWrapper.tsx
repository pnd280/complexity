import { useQueryClient } from "@tanstack/react-query";

import type { PluginId, PluginMeta } from "@/__registries__/plugins/meta.types";
import AsyncButton from "@/components/AsyncButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InlineCode } from "@/components/ui/typography";
import { extensionPermissionsQueries } from "@/services/infra/extension-api-wrappers/extension-permissions/query-keys";
import { useExtensionPermissions } from "@/services/infra/extension-api-wrappers/extension-permissions/useExtensionPermissions";
import { requestPermissions } from "@/services/infra/extension-api-wrappers/extension-permissions/utils";

export default function RequirePermissionsDialogWrapper({
  children,
  requiredPermissions,
  onGranted,
  asChild,
}: {
  children: React.ReactNode;
  requiredPermissions: NonNullable<
    PluginMeta<PluginId>["extensionPermissions"]
  >["requiredPermissions"];
  onGranted?: () => void;
  asChild?: boolean;
}) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const { data: grantedPermissions, isLoading: isPermissionsLoading } =
    useExtensionPermissions();

  const hasAllRequiredPermissions = useMemo(() => {
    if (requiredPermissions == null || grantedPermissions == null) return true;

    return requiredPermissions.every(({ permission }) =>
      grantedPermissions.permissions?.includes(permission),
    );
  }, [requiredPermissions, grantedPermissions]);

  if (hasAllRequiredPermissions || isPermissionsLoading) {
    return children;
  }

  return (
    <Dialog
      unmountOnExit
      lazyMount
      open={open}
      onOpenChange={({ open }) => setOpen(open)}
    >
      <DialogTrigger
        asChild={asChild}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(true);
        }}
      >
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Permission(s) Required</DialogTitle>
          <DialogDescription>
            The following permissions are required to use this feature
          </DialogDescription>
        </DialogHeader>
        <div className="x:flex x:flex-col x:gap-4">
          {requiredPermissions?.map(({ permission, rationale }) => (
            <div key={permission} className="x:flex x:flex-col x:gap-2">
              <InlineCode className="x:w-fit x:text-xl x:text-primary">
                {permission}
              </InlineCode>
              <div className="x:flex x:items-start x:gap-4">
                <span className="x:text-muted-foreground">Rationale</span>
                <span>{rationale}</span>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <AsyncButton
            loadingText="Requesting..."
            onClick={async () => {
              if (requiredPermissions == null) return;

              const result = await requestPermissions(
                requiredPermissions.map(({ permission }) => permission),
              );

              void queryClient.invalidateQueries({
                queryKey: extensionPermissionsQueries.permissions.all(),
              });

              onGranted?.();

              if (result) {
                setOpen(false);
              }
            }}
          >
            I understand, grant the above permission(s)
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
