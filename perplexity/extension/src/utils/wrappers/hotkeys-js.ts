import hotkeys from "hotkeys-js";

const hotkeysJs = hotkeys.noConflict();

hotkeysJs.filter = (event: KeyboardEvent) => {
  return true;
};

export default hotkeysJs;

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
