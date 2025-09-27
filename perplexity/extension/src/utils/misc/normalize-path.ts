import * as path from "path";

export function normalizePath(filePath: string, dirname?: string): string {
  return path.posix.join(
    ...path
      .resolve(
        dirname ?? process.cwd() ?? path.resolve(__dirname, "../.."),
        filePath,
      )
      .split(path.sep),
  );
}
