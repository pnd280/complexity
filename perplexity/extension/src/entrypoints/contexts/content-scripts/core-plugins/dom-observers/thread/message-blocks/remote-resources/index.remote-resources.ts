import { z } from "zod";

import { localThreadMessageBlocksFiberConfig } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/message-blocks/remote-resources/fallback";
import { defineVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources";

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
