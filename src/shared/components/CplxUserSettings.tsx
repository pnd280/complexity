import { TabsRootProps } from "@ark-ui/react";
import { FlaskConical } from "lucide-react";

import GeneralSettings from "@/cplx-user-settings/components/GeneralSettings";
import CanvasSettings from "@/options-page/components/CanvasSettings";
import Changelog from "@/options-page/components/Changelog";
import CustomTheme from "@/options-page/components/CustomTheme";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/Tabs";
import useQueryParams from "@/shared/hooks/useQueryParams";

export default function CplxUserSettings({ ...props }: TabsRootProps) {
  const [queryParams, setQueryParams] = useQueryParams<{
    tab: string;
  }>();

  return (
    <Tabs
      defaultValue={"generalSettings"}
      value={queryParams.tab ?? "generalSettings"}
      activationMode="manual"
      orientation="vertical"
      className="tw-flex tw-h-full tw-w-full tw-gap-4 tw-font-sans"
      onValueChange={({ value }) => {
        setQueryParams({ tab: value }, { replace: true });
      }}
      {...props}
    >
      <TabsList className="tw-sticky tw-top-0 tw-bg-transparent">
        <TabsTrigger value="generalSettings">General</TabsTrigger>
        <TabsTrigger value="canvas">
          <FlaskConical className="tw-mr-2 tw-size-3" /> Canvas
        </TabsTrigger>
        <TabsTrigger value="customTheme">Custom theme</TabsTrigger>
        <TabsTrigger value="changelog">Changelog</TabsTrigger>
      </TabsList>
      <div className="tw-h-full tw-w-full">
        <TabsContent value="generalSettings">
          <GeneralSettings />
        </TabsContent>
        <TabsContent value="canvas">
          <CanvasSettings />
        </TabsContent>
        <TabsContent value="customTheme">
          <CustomTheme />
        </TabsContent>
        <TabsContent value="changelog">
          <Changelog />
        </TabsContent>
      </div>
    </Tabs>
  );
}
