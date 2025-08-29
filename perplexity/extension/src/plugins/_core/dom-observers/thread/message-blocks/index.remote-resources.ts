import { z } from "zod";

import { localFiberNodePath } from "@/plugins/_core/main-world/react-vdom/actions/get-messages";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const messageBlocksReactFiberNodePathResourceConfig =
  defineVersionedRemoteResource({
    name: "message-blocks-react-fiber-node-path",
    type: "txt",
    fallback: localFiberNodePath.join("."),
    zodSchema: z.string(),
  });
