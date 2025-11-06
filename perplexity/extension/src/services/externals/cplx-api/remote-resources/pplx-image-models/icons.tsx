import BlackForestLabs from "@/components/icons/BlackForestLabsIcon";
import { IconParkOutlineBytedance } from "@/components/icons/ByteDance";
import type { ImageModel } from "@/services/externals/cplx-api/remote-resources/pplx-image-models/types";

import SiGoogleGemini from "~icons/simple-icons/googlegemini";
import SiOpenai from "~icons/simple-icons/openai";
import TablerArrowsShuffle from "~icons/tabler/arrows-shuffle";

export const imageModelIcons: Record<ImageModel["code"], React.ElementType> = {
  default: TablerArrowsShuffle,
  "gpt-4o-image": SiOpenai,
  flux: BlackForestLabs,
  "dall-e-3": SiOpenai,
  "gemini-flash": SiGoogleGemini,
  seedream: IconParkOutlineBytedance,
};
