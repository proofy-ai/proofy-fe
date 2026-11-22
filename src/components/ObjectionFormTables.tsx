import type { ReactNode } from "react";

import type { ObjectionFormFields } from "@/lib/objectionForm";

const CELL_CLASS = "border-l border-black px-2 py-1 align-top";

function Cell({
  label,
  value,
  colSpan,
  hasTopLine = false,
}: {
  label: string;
  value?: string;
  colSpan?: number;
  hasTopLine?: boolean;
}) {
  return (
    <td
      colSpan={colSpan}
      className={`${CELL_CLASS} h-[46px] ${hasTopLine ? "border-t" : ""}`}
    >
      <div className="text-[11px] text-gray-700">{label}</div>
      <div className="text-[13px] font-medium">{value}</div>
    </td>
  );
}

function SideLabel({ children, rows }: { children: ReactNode; rows: number }) {
  return (
    <th rowSpan={rows} className="w-[84px] text-center text-[14px] font-normal">
      {children}
    </th>
  );
}

export function ReceiptTable() {
  return (
    <table className="w-full border-collapse border-y-2 border-black bg-gray-300">
      <tbody>
        <tr>
          <td className="h-[34px] w-1/2 px-2 text-[12px]">접수번호</td>
          <td className="border-l border-black px-2 text-[12px]">접수일자</td>
        </tr>
      </tbody>
    </table>
  );
}

export function ApplicantTable({ fields }: { fields: ObjectionFormFields }) {
  return (
    <table className="w-full border-collapse border-y border-black">
      <tbody>
        <tr>
          <SideLabel rows={3}>신청인</SideLabel>
          <Cell label="성 명" value={fields.applicantName} colSpan={2} />
          <Cell label="생년월일" value={fields.birthDate} />
        </tr>
        <tr>
          <Cell label="주 소" value={fields.address} colSpan={3} hasTopLine />
        </tr>
        <tr>
          <Cell label="전화번호" value={fields.phone} hasTopLine />
          <Cell label="휴대전화번호" value={fields.mobilePhone} hasTopLine />
          <Cell label="전자우편주소" value={fields.email} hasTopLine />
        </tr>
      </tbody>
    </table>
  );
}

export function AccountTable({ fields }: { fields: ObjectionFormFields }) {
  return (
    <table className="w-full border-collapse border-y border-black">
      <tbody>
        <tr>
          <SideLabel rows={2}>
            지급정지
            <br />
            계좌등
          </SideLabel>
          <Cell label="금융회사등" value={fields.financialCompany} />
          <Cell label="개설점포" value={fields.branch} />
          <Cell label="자산종류" value={fields.assetType} />
        </tr>
        <tr>
          <Cell
            label="계좌번호 또는 계정정보"
            value={fields.accountNumber}
            colSpan={2}
            hasTopLine
          />
          <Cell label="명의인" value={fields.accountHolder} hasTopLine />
        </tr>
      </tbody>
    </table>
  );
}
