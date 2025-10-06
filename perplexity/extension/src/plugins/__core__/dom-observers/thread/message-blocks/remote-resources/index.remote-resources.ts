import { z } from "zod";

import { localThreadMessageBlocksFiberConfig } from "@/plugins/__core__/dom-observers/thread/message-blocks/remote-resources/fallback";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const threadMessageBlocksFiberConfigResourceConfig =
  defineVersionedRemoteResource({
    name: "corePlugin.domObservers.thread.messageBlocks.fiberConfig",
    type: "json",
    fallback: localThreadMessageBlocksFiberConfig,
    zodSchema: z.object({
      name: z.string(),
      messageNodePath: z.array(z.string()),
    }),
  });
