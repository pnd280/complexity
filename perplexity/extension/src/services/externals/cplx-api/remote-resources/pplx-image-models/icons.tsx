import { FaShuffle } from "react-icons/fa6";
import { SiGooglegemini, SiOpenai } from "react-icons/si";

import BlackForestLabs from "@/components/icons/BlackForestLabsIcon";
import { IconParkOutlineBytedance } from "@/components/icons/ByteDance.";
import type { ImageModel } from "@/services/externals/cplx-api/remote-resources/pplx-image-models/types";

export const imageModelIcons: Record<ImageModel["code"], React.ElementType> = {
  default: FaShuffle,
  "gpt-4o-image": SiOpenai,
  flux: BlackForestLabs,
  "dall-e-3": SiOpenai,
  "gemini-flash": SiGooglegemini,
  seedream: IconParkOutlineBytedance,
};
