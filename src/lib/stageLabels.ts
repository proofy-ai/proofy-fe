import type { Stage } from "@/types/api";

export const STAGE_LABELS = {
  EXTRACTING: "서류 꼼꼼히 읽기",
  COMPARING: "사연과 거래내역 맞춰 보기",
  DRAFTING: "소명서 초안 쓰기",
  FINISHED: "결과 정리하기",
} satisfies Record<Stage, string>;
