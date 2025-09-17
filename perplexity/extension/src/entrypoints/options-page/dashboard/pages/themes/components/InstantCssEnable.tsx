import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InlineCode, Ul } from "@/components/ui/typography";
import { toast } from "@/components/ui/use-toast";
import { useExtensionPermissions } from "@/services/infra/extension-api-wrappers/extension-permissions/useExtensionPermissions";

export default function PreloadThemeSwitch() {
  const { data: grandtedPermissions, handleGrantPermission } =
    useExtensionPermissions();

  const hasPermissions =
    grandtedPermissions?.permissions?.includes("scripting") &&
    grandtedPermissions?.permissions?.includes("webNavigation");

  if (hasPermissions) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Enable Faster Theme Loading</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable Faster Theme Loading</DialogTitle>
        </DialogHeader>
        <div className="x:space-y-4">
          <div>
            <span className="x:font-semibold x:text-primary">
              What this does?
            </span>
            <Ul>
              <li>
                Your custom styles will be applied before the page loads, which
                will avoid a brief flash and result in a smoother experience.
              </li>
            </Ul>
          </div>

          <div>
            <span>
              You&apos;ll be asked to give the extension special{" "}
              <Tooltip
                content={
                  <div className="x:p-2">
                    Instead of applying themes after the page loads (which can
                    cause a brief flash), Complexity applies your theme before
                    the page appears. This creates a smooth, seamless experience
                    without any flickering. Complexity{" "}
                    <span className="x:font-semibold x:underline">ONLY</span>{" "}
                    uses this permissions to apply your themes - it never tracks
                    where you browse or collects any personal information.
                    Contact the developer if you have any further questions.
                  </div>
                }
              >
                <InlineCode className="x:bg-background x:underline x:decoration-dashed">
                  navigation
                </InlineCode>
              </Tooltip>{" "}
              permissions.
            </span>
            <Ul>
              <li>
                While the permission request dialog mentions access to browsing
                history, we{" "}
                <span className="x:font-semibold x:text-primary x:underline">
                  NEVER
                </span>{" "}
                look at or save any of your browsing data
              </li>
              <li>
                These permissions are only used to apply your themes smoothly
              </li>
              <li>
                You can always revoke this permission at any time on the
                Settings page
              </li>
            </Ul>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={async () => {
              await handleGrantPermission({
                permissions: ["webNavigation"],
              });

              toast({
                title: "✅ Permissions granted",
                description: "Custom styles will now be applied faster.",
              });
            }}
          >
            Grant Permissions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
