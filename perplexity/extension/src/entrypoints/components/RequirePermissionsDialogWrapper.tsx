import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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
import { extensionPermissionsQueries } from "@/entrypoints/services/extension-api-wrappers/permissions/query-keys";
import { useExtensionPermissions } from "@/entrypoints/services/extension-api-wrappers/permissions/useExtensionPermissions";
import type { PluginPermissions } from "@/entrypoints/services/plugins/types";

export default function RequirePermissionsDialogWrapper({
  children,
  requiredPermissions,
  onGranted,
  asChild,
}: {
  children: React.ReactNode;
  requiredPermissions: NonNullable<PluginPermissions>["requiredPermissions"];
  onGranted?: () => void;
  asChild?: boolean;
}) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const { data: grantedPermissions, isLoading: isPermissionsLoading } =
    useExtensionPermissions();

  const hasAllRequiredPermissions = (() => {
    if (requiredPermissions == null || grantedPermissions == null) return true;

    return requiredPermissions.every(({ permissions }) =>
      permissions.every((p) => grantedPermissions.permissions?.includes(p)),
    );
  })();

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
          {requiredPermissions?.map(({ permissions, rationale }, idx) => (
            <div key={idx} className="x:flex x:flex-col x:gap-2">
              <div className="x:flex x:items-center x:gap-2">
                {permissions.map((permission, idx) => (
                  <InlineCode
                    key={idx}
                    className="x:w-fit x:text-xl x:text-primary"
                  >
                    {permission}
                  </InlineCode>
                ))}
              </div>
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

              const result = await chrome.permissions.request({
                permissions: requiredPermissions.flatMap(
                  ({ permissions }) => permissions,
                ),
              });

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
