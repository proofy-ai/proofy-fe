import { resolveApiUrl } from "@/api/client";
import type { Evidence, SampleFile } from "@/types/api";

export const getSampleImageUrls = (
  items: Evidence[],
  sampleFiles: SampleFile[],
): Record<string, string> => {
  const urls: Record<string, string> = {};
  items
    .filter((item) => item.isSample && item.mimeType.startsWith("image/"))
    .forEach((item) => {
      const sampleFile = sampleFiles.find(
        (file) => file.name === item.originalName,
      );
      if (sampleFile) urls[item.evidenceId] = resolveApiUrl(sampleFile.url);
    });
  return urls;
};
