import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import usePluginsStates from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginsStates";
import {
  OPTIONAL_PERMISSIONS,
  OPTIONAL_PERMISSIONS_DETAILS,
} from "@/services/infra/extension-permissions/permissions";
import { useExtensionPermissions } from "@/services/infra/extension-permissions/useExtensionPermissions";
import useExtensionSettings from "@/services/infra/extension-settings/useExtensionSettings";

export default function ManagePermissionsDialogWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    query: { data: grantedPermissions },
    handleGrantPermission,
    handleRevokePermission,
  } = useExtensionPermissions();

  const { pluginsStates } = usePluginsStates();
  const { settings } = useExtensionSettings();

  if (grantedPermissions == null) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Permissions</DialogTitle>
          <DialogDescription>
            Grant or revoke extension permissions. Please note that some
            features may be disabled without the necessary permissions.
          </DialogDescription>
          {OPTIONAL_PERMISSIONS.length > 0 ? (
            OPTIONAL_PERMISSIONS.map((permission) => {
              const activePlugins = OPTIONAL_PERMISSIONS_DETAILS[
                permission
              ]?.dependantPlugins.filter(
                (plugin) =>
                  !pluginsStates[plugin.id].isOnMaintenance &&
                  !pluginsStates[plugin.id].isOutdated &&
                  settings?.plugins[plugin.id]?.enabled,
              );

              return (
                <div
                  key={permission}
                  className="x:!mt-4 x:flex x:flex-col x:gap-2"
                >
                  <Switch
                    textLabel={
                      <div className="x:flex x:flex-col">
                        <div className="x:text-lg x:font-medium x:text-primary">
                          {permission}
                        </div>
                      </div>
                    }
                    checked={grantedPermissions.permissions?.includes(
                      permission,
                    )}
                    onCheckedChange={() => {
                      if (
                        grantedPermissions.permissions?.includes(permission)
                      ) {
                        handleRevokePermission({ permissions: [permission] });
                      } else {
                        handleGrantPermission({ permissions: [permission] });
                      }
                    }}
                  />
                  {activePlugins && (
                    <div className="x:ml-14">
                      <span
                        className={"x:text-lg x:font-medium x:text-primary"}
                      >
                        {activePlugins.length}{" "}
                      </span>
                      <span className="x:text-muted-foreground">
                        plugin(s) is currently using this permission
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="x:mx-auto x:block x:py-16 x:text-muted-foreground x:italic">
              You&apos;re all set!
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
