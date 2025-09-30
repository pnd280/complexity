import { z } from "zod";

import { localFiberNodePath } from "@/plugins/__core__/dom-observers/thread/message-blocks/remote-resources/fallback";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const messageBlocksReactFiberNodePathResourceConfig =
  defineVersionedRemoteResource({
    name: "message-blocks-react-fiber-node-path",
    type: "txt",
    fallback: localFiberNodePath.join("."),
    zodSchema: z.string(),
  });
