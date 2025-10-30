import * as path from "path";

export function normalizePath(filePath: string, dirname?: string): string {
  return path.posix.join(
    ...path
      .resolve(
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        dirname ?? process.cwd() ?? path.resolve(__dirname, "../.."),
        filePath,
      )
      .split(path.sep),
  );
}
