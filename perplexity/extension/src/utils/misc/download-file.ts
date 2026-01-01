import { APP_CONFIG } from "@/app.config";

const MIME_TYPE_TO_EXTENSION: Record<string, string> = {
  "application/json": ".json",
  "text/markdown": ".md",
  "text/plain": ".txt",
  "audio/wav": ".wav",
  "audio/wave": ".wav",
};

const EXTENSION_TO_MIME_TYPE: Record<string, string> = Object.entries(
  MIME_TYPE_TO_EXTENSION,
).reduce(
  (acc, [mimeType, ext]) => {
    acc[ext] = mimeType;
    return acc;
  },
  {} as Record<string, string>,
);

export default async function downloadFile({
  data,
  filename,
  mimeType,
  useFilePicker = false,
}: {
  data: string | ArrayBuffer;
  filename: string;
  mimeType?: string;
  useFilePicker?: boolean;
}) {
  const resolvedMimeType =
    mimeType || inferMimeTypeFromFilename(filename) || "application/json";

  // File System Access API requires active user gesture, which is often lost
  // after async operations. Only use it when explicitly requested.
  if (
    useFilePicker &&
    APP_CONFIG.BROWSER === "chrome" &&
    "showSaveFilePicker" in window
  ) {
    await downloadFileChrome(data, filename, resolvedMimeType);
  } else {
    downloadFileGeneric(data, filename, resolvedMimeType);
  }
}

function inferMimeTypeFromFilename(filename: string): string | null {
  const ext = filename.substring(filename.lastIndexOf("."));
  return EXTENSION_TO_MIME_TYPE[ext] || null;
}

async function downloadFileChrome(
  data: string | ArrayBuffer,
  filename: string,
  mimeType: string,
) {
  try {
    const extension = MIME_TYPE_TO_EXTENSION[mimeType] || ".bin";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handle = await (window as any).showSaveFilePicker({
      suggestedName: filename,
      types: [
        {
          description: "File",
          accept: {
            [mimeType]: [extension],
          },
        },
      ],
    });

    const writable = await handle.createWritable();
    await writable.write(data);
    await writable.close();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      // User cancelled the save dialog - throw so caller knows
      throw new Error("Download cancelled");
    }
    console.error("Failed to save file:", error);
    throw error;
  }
}

function downloadFileGeneric(
  data: string | ArrayBuffer,
  filename: string,
  mimeType: string,
) {
  try {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error: unknown) {
    console.error("Failed to save file:", error);
    throw error;
  }
}
