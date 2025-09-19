import CometAssistantQueryBoxWrapper from "@/plugins/_core/ui/groups/query-box/comet-assistant/CometAssistant";
import FollowUpQueryBoxWrapper from "@/plugins/_core/ui/groups/query-box/follow-up/FollowUp";
import MainQueryBoxWrapper from "@/plugins/_core/ui/groups/query-box/main/Main";
import SpaceQueryBoxWrapper from "@/plugins/_core/ui/groups/query-box/space/Space";
import { shouldEnableUiGroup } from "@/plugins/_core/ui/groups/utils";

export function QueryBoxComponents() {
  const shouldEnableMain = useMemo(
    () => shouldEnableUiGroup({ uiGroup: "queryBoxes:toolbar:main" }),
    [],
  );

  const shouldEnableSpace = useMemo(
    () => shouldEnableUiGroup({ uiGroup: "queryBoxes:toolbar:space" }),
    [],
  );

  const shouldEnableFollowUp = useMemo(
    () => shouldEnableUiGroup({ uiGroup: "queryBoxes:toolbar:followUp" }),
    [],
  );

  const shouldEnableCometAssistant = useMemo(
    () => shouldEnableUiGroup({ uiGroup: "queryBoxes:toolbar:cometAssistant" }),
    [],
  );

  return (
    <>
      {shouldEnableMain && <MainQueryBoxWrapper />}
      {shouldEnableSpace && <SpaceQueryBoxWrapper />}
      {shouldEnableFollowUp && <FollowUpQueryBoxWrapper />}
      {shouldEnableCometAssistant && <CometAssistantQueryBoxWrapper />}
    </>
  );
}
