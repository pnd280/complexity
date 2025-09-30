import type { SandpackState } from "@codesandbox/sandpack-react";
import LZString from "lz-string";

type CreateCodeSandboxOptions = {
  files: SandpackState["files"];
};

function normalizeFilesParam({ files }: CreateCodeSandboxOptions): {
  [key: string]: { content: string };
} {
  const normalFiles = Object.fromEntries(
    Object.entries(files).map(([key, value]) => [key, { content: value.code }]),
  );

  return normalFiles;
}

export async function createSandbox(files: SandpackState["files"]) {
  function getParameters(parameters: any) {
    return LZString.compressToBase64(JSON.stringify(parameters))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  const parameters = getParameters({
    files: normalizeFilesParam({ files }),
  });

  const response = await fetch(
    "https://codesandbox.io/api/v1/sandboxes/define?json=1",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parameters }),
    },
  );
  const data = await response.json();

  return `https://codesandbox.io/s/${data.sandbox_id}`;
}
