import { default as hotkeysJs } from "hotkeys-js";

const hotkeys: typeof hotkeysJs = hotkeysJs.noConflict();

hotkeys.filter = (_event: KeyboardEvent) => {
  return true;
};

export default hotkeys;

export function isFormTag(event: KeyboardEvent) {
  const target = event.target as HTMLElement;
  const tagName = target.tagName;
  return (
    target.isContentEditable ||
    tagName == "INPUT" ||
    tagName == "SELECT" ||
    tagName == "TEXTAREA"
  );
}
