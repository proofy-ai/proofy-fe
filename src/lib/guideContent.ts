export const SUBMISSION_DOCUMENTS = [
  {
    title: "이의제기신청서",
    description: "별지 제4호서식. 은행 창구·양식으로 작성해요.",
    handledBy: "서비스에서 작성",
  },
  {
    title: "소명자료",
    description: "사기이용계좌가 아니라는 사실을 보여 주는 자료예요.",
    handledBy: "AI가 정리",
  },
  {
    title: "신분증 사본",
    description: "이 서비스는 받지 않아요. 은행에 낼 때 직접 첨부하세요.",
    handledBy: "직접 첨부",
  },
];

export const AFTER_SUBMIT_STEPS = [
  "은행에 이의제기신청서와 소명자료를 직접 제출해요.",
  "은행이 원칙적으로 5영업일 안에 심사해요.",
  "보완을 요구하면 정해진 기한 안에 다시 제출해요.",
];

export const FALSE_OBJECTION_WARNING =
  "사실과 다른 내용을 내는 거짓 이의제기는 처벌받을 수 있어요.";
