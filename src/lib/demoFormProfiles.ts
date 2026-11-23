import {
  createEmptyFormFields,
  type ObjectionFormFields,
} from "@/lib/objectionForm";
import type { SampleScenario } from "@/types/api";

type DemoProfile = Omit<ObjectionFormFields, "applicationDate">;

const DEMO_FORM_PROFILES: Partial<Record<SampleScenario, DemoProfile>> = {
  GOODS: {
    applicantName: "정하늘",
    birthDate: "1998.03.14",
    address: "서울특별시 샘플구 시연로 12, 101호",
    phone: "02-123-4567",
    mobilePhone: "010-1234-5678",
    email: "sample01@example.com",
    financialCompany: "샘플은행",
    branch: "시연지점",
    assetType: "입출금통장",
    accountNumber: "999-0000-1234-56",
    accountHolder: "정하늘",
  },
  UNEXPECTED: {
    applicantName: "한도윤",
    birthDate: "2001.07.22",
    address: "서울특별시 샘플구 체험로 34, 202호",
    phone: "02-987-6543",
    mobilePhone: "010-9876-5432",
    email: "sample02@example.com",
    financialCompany: "샘플은행",
    branch: "시연지점",
    assetType: "입출금통장",
    accountNumber: "999-0000-5678-90",
    accountHolder: "한도윤",
  },
};

export const createInitialFormFields = (
  applicationDate: string,
  trialScenario: SampleScenario | null,
): ObjectionFormFields => {
  const demoProfile = trialScenario ? DEMO_FORM_PROFILES[trialScenario] : null;

  return demoProfile
    ? { ...demoProfile, applicationDate }
    : createEmptyFormFields(applicationDate);
};
