import { TabsRootProps } from "@ark-ui/react";
import { FlaskConical } from "lucide-react";

import About from "@/cplx-user-settings/components/About";
import CanvasSettings from "@/cplx-user-settings/components/CanvasSettings";
import Changelog from "@/cplx-user-settings/components/Changelog";
import CustomTheme from "@/cplx-user-settings/components/CustomTheme";
import GeneralSettings from "@/cplx-user-settings/components/GeneralSettings";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/Tabs";
import useQueryParams from "@/shared/hooks/useQueryParams";

const tabs = [
  "generalSettings",
  "canvas",
  "customTheme",
  "changelog",
  "about",
] as const;

type Tab = (typeof tabs)[number];

export default function CplxUserSettings({ ...props }: TabsRootProps) {
  const [queryParams, setQueryParams] = useQueryParams<{
    tab: string;
  }>();

  return (
    <Tabs
      defaultValue={"generalSettings"}
      value={
        tabs.includes(queryParams.tab as Tab)
          ? queryParams.tab
          : "generalSettings"
      }
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
        <TabsTrigger value="changelog">Release notes</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
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
        <TabsContent value="about" className="tw-h-full tw-w-full">
          <About />
        </TabsContent>
      </div>
    </Tabs>
  );
}
