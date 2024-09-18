import { FocusMode } from "@/content-script/components/QueryBox";
import { focusModes } from "@/content-script/components/QueryBox/consts";

export function isValidFocus(focus?: any): focus is FocusMode["code"] {
  return focusModes.some((model) => model.code === focus);
}
