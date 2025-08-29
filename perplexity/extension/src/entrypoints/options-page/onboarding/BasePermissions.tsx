import type { ComponentType, SVGProps } from "react";
import { HiCheckCircle } from "react-icons/hi2";
import { LuDatabase } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { H1, H3, P } from "@/components/ui/typography";
import { useExtensionPermissions } from "@/services/infra/extension-permissions/useExtensionPermissions";

const basePermissionsDetails: Record<
  string,
  {
    permissions?: chrome.runtime.ManifestPermissions[];
    title: string;
    description: React.ReactNode;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
  }
> = {
  storage: {
    permissions: ["storage"],
    title: "Extension Storage Access",
    description: (
      <div>
        <div>
          <div>Store your settings locally in extension storage.</div>
          <div>
            The extension does NOT have access to browsing history, bookmarks,
            or other data.
          </div>
        </div>
        <div className="x:mt-2">
          This permission is automatically granted when installing the
          extension.
        </div>
      </div>
    ),
    icon: LuDatabase,
  },
};

export default function BasePermissions() {
  const {
    query: { data: permissions },
    handleGrantPermission,
  } = useExtensionPermissions();

  const grantedPermissions = new Set([
    ...(permissions?.permissions ?? []),
    ...(permissions?.origins ?? []),
  ]);

  if (!permissions) return null;

  return (
    <div className="x:mx-auto x:flex x:max-w-2xl x:flex-col x:gap-4 x:px-2 x:md:gap-8 x:md:px-4">
      <H1 className="x:text-center x:text-balance">
        Complexity needs your permissions to work
      </H1>

      <div className="x:space-y-3 x:md:space-y-4">
        {Object.entries(basePermissionsDetails).map(
          ([key, { title, permissions, description, icon: Icon }]) => {
            const isGranted = permissions?.every((p) =>
              grantedPermissions.has(p),
            );
            return (
              <Card
                key={key}
                data-granted={isGranted ? true : undefined}
                className={cn(
                  "x:group x:border-border/50 x:transition-all x:duration-500 x:ease-in-out x:data-[granted]:bg-primary/10 x:data-[granted]:shadow-lg",
                )}
              >
                <CardContent className="x:flex x:items-start x:gap-3 x:p-3 x:md:items-center x:md:gap-4 x:md:p-4">
                  <div className="x:flex x:h-8 x:w-8 x:shrink-0 x:items-center x:justify-center x:self-start x:rounded-md x:bg-primary-foreground x:text-primary x:md:h-9 x:md:w-9">
                    <Icon className="x:size-4 x:md:size-5" />
                  </div>
                  <div className="x:flex-grow x:space-y-1.5 x:md:space-y-2">
                    <H3 className="x:text-sm x:font-medium x:text-primary x:md:text-base">
                      {title}
                    </H3>
                    <div className="x:text-xs x:text-foreground x:md:text-sm">
                      {description}
                    </div>
                    <div className="x:mt-2 x:flex x:items-center x:justify-end">
                      <Button
                        size="sm"
                        variant={isGranted ? "outline" : "default"}
                        disabled={isGranted}
                        className="x:text-xs x:group-data-[granted]:text-success x:group-data-[granted]:!opacity-100 x:md:text-sm"
                        onClick={() =>
                          handleGrantPermission({
                            permissions: permissions ?? [],
                          })
                        }
                      >
                        {isGranted ? (
                          <span className="x:flex x:items-center x:gap-1.5 x:md:gap-2">
                            <HiCheckCircle className="x:h-3.5 x:w-3.5 x:md:h-4 x:md:w-4" />
                            Granted
                          </span>
                        ) : (
                          "Grant Permission"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          },
        )}
        <P className="x:text-center x:text-xs x:text-balance x:text-muted-foreground x:md:text-sm">
          You may be asked to grant additional permissions for certain features.
          Rest assured that you&apos;ll always be prompted for consent before
          any action.
        </P>
      </div>
    </div>
  );
}
