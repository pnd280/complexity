import { exec } from "child_process";
import path from "path";
import { promisify } from "util";
export { invariant } from "#/src/utils/misc/utils";

export function getRootPath() {
  return path.resolve(__dirname, "../../");
}

export const execAsync = promisify(exec);
