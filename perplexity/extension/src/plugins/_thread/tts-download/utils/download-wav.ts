import downloadFile from "@/utils/misc/download-file";

import { WavEncoder } from "./wav-encoder";

type DownloadWavFileProps = {
  chunks: Int16Array[];
  filename: string;
  sampleRate?: number;
};

/**
 * Download audio chunks as a WAV file
 */
export async function downloadWavFile({
  chunks,
  filename,
  sampleRate = 48000,
}: DownloadWavFileProps): Promise<void> {
  // Encode chunks to WAV format
  const wavBuffer = WavEncoder.encode(chunks, sampleRate);

  // Ensure filename has .wav extension
  const filenameWithExt = filename.endsWith(".wav")
    ? filename
    : `${filename}.wav`;

  // Download using the existing download utility
  await downloadFile({
    data: wavBuffer,
    filename: filenameWithExt,
    mimeType: "audio/wav",
  });
}
