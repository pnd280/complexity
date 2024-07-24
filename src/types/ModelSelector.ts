import {
  WebAccessFocus,
  webAccessFocus
} from "@/content-script/components/QueryBox";

export function isValidFocus(focus?: any): focus is WebAccessFocus["code"] {
  return webAccessFocus.some((model) => model.code === focus);
}
