import { resolveApiUrl } from "@/api/client";
import type { SampleFile } from "@/types/api";

type Props = {
  sampleFiles: SampleFile[];
};

export function SampleDownloadNotice({ sampleFiles }: Props) {
  return (
    <>
      <p className="break-keep text-sm text-ink-sub">
        시연용 서비스입니다. 실제 서류 대신 샘플(합성) 서류만 올려 주세요.
      </p>
      {sampleFiles.length > 0 && (
        <ul className="flex flex-col gap-1 rounded-xl bg-brand-soft px-4 py-3">
          {sampleFiles.map((file) => (
            <li key={file.url}>
              <a
                href={resolveApiUrl(file.url)}
                download={file.name}
                className="text-sm text-ink underline"
              >
                샘플 서류 받기: {file.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
