import { WebAccessFocus } from "@/content-script/components/QueryBox";
import { webAccessFocus } from "@/content-script/components/QueryBox/consts";

export function isValidFocus(focus?: any): focus is WebAccessFocus["code"] {
  return webAccessFocus.some((model) => model.code === focus);
}
