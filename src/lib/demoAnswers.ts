import type { SampleScenario } from "@/types/api";

const DEMO_ANSWERS: Partial<Record<SampleScenario, string[]>> = {
  GOODS: [
    "3개는 12만 원에 합의했는데, 다음 날 1개를 3만 원에 추가로 주문받아 합계 15만 원이 입금됐어요. 추가 주문 내용도 카톡에 남아 있어요.",
    "11월 9일에 편의점 택배로 보냈어요. 송장 사진이 있어서 함께 올릴게요.",
  ],
  UNEXPECTED: [
    "제가 11월 11일로 기억했는데, 거래내역서대로 입금은 11월 12일이 맞아요.",
    "11월 13일에 은행 고객센터에 전화로 알렸고, 접수번호는 따로 적어 두지 못했어요.",
  ],
};

export const getDemoAnswer = (
  scenario: SampleScenario | null,
  questionIndex: number,
) => (scenario ? (DEMO_ANSWERS[scenario]?.[questionIndex] ?? "") : "");
