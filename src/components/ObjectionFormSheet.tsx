import type { RefObject } from "react";

import {
  AccountTable,
  ApplicantTable,
  ReceiptTable,
} from "@/components/ObjectionFormTables";
import {
  formatApplicationDate,
  type ObjectionFormFields,
  PAGE_HEIGHT_PX,
  PAGE_WIDTH_PX,
} from "@/lib/objectionForm";

const PAGE_CLASS =
  "flex flex-col gap-3 bg-white p-[56px] text-[13px] leading-[1.7] text-black";

const STATEMENT =
  "「전기통신금융사기 피해 방지 및 피해자산 환급에 관한 특별법」 제7조제1항 및 같은 법 시행령 제7조에 따라 본인의 계좌 또는 계정에 대한 지급정지, 전자금융거래등의 제한 또는 채권소멸절차에 대하여 위와 같이 이의제기를 신청합니다.";

type FirstPageProps = {
  fields: ObjectionFormFields;
  reasonText: string;
};

function FormFooter({ fields }: { fields: ObjectionFormFields }) {
  const { year, month, day } = formatApplicationDate(fields.applicationDate);

  return (
    <>
      <p className="break-keep">{STATEMENT}</p>
      <p className="text-right">
        {year}년 {month}월 {day}일
      </p>
      <p className="text-center">
        신청인 성 명 {fields.applicantName}
        <span className="ml-16 text-[12px]">(서명 또는 인)</span>
      </p>
      <p className="border-b-4 border-gray-400 pb-2 text-[17px] font-bold">
        {fields.financialCompany || "○○○ 금융회사등"}
        <span className="ml-2 text-[12px] font-normal">귀하</span>
      </p>
      <table className="w-full border-collapse border-y border-black text-[12px]">
        <tbody>
          <tr>
            <th className="w-[84px] font-normal">첨부서류</th>
            <td className="border-x border-black px-2 py-1">
              1. 사기이용계좌등이 아니라는 사실을 증명하는 자료 1부
              <br />
              2. 사기이용계좌등 명의인의 신분증 사본 1부
            </td>
            <td className="w-[84px] text-center">
              수수료
              <br />
              없음
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function FirstPage({ fields, reasonText }: FirstPageProps) {
  return (
    <>
      <p className="text-[11px]">
        ■ 전기통신금융사기 피해 방지 및 피해자산 환급에 관한 특별법 시행령 [별지
        제4호서식]{" "}
        <span className="text-blue-700">{"<개정 2026. 9. 29.>"}</span>
      </p>
      <h2 className="text-center text-[28px] font-bold tracking-widest">
        이의제기신청서
      </h2>
      <p className="text-[11px]">
        ※ 색상이 어두운 란은 신청인이 적지 않습니다.
      </p>
      <ReceiptTable />
      <ApplicantTable fields={fields} />
      <AccountTable fields={fields} />
      <p className="mt-2 text-[15px] font-bold">
        이의제기 사유(구체적으로 기재합니다)
      </p>
      <p className="min-h-[290px] whitespace-pre-line border-b-2 border-black text-[12.5px] text-gray-800">
        {reasonText}
      </p>
      <FormFooter fields={fields} />
    </>
  );
}

function ContinuationPage({ reasonText }: { reasonText: string }) {
  return (
    <>
      <h2 className="text-[18px] font-bold">이의제기 사유(계속)</h2>
      <p className="whitespace-pre-line">{reasonText}</p>
    </>
  );
}

type Props = {
  fields: ObjectionFormFields;
  reasonPages: string[];
  containerRef?: RefObject<HTMLDivElement | null>;
};

export function ObjectionFormSheet({
  fields,
  reasonPages,
  containerRef,
}: Props) {
  return (
    <div ref={containerRef} className="flex flex-col gap-4">
      {reasonPages.map((reasonText, index) => (
        <div
          key={index}
          style={{ width: PAGE_WIDTH_PX, minHeight: PAGE_HEIGHT_PX }}
          className={PAGE_CLASS}
        >
          {index === 0 ? (
            <FirstPage fields={fields} reasonText={reasonText} />
          ) : (
            <ContinuationPage reasonText={reasonText} />
          )}
        </div>
      ))}
    </div>
  );
}
