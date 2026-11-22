import { FormField } from "@/components/FormField";
import { INPUT_CLASS } from "@/lib/formClassNames";
import type { ObjectionFormFields } from "@/lib/objectionForm";

type InputSpec = {
  key: keyof ObjectionFormFields;
  label: string;
  placeholder: string;
  type?: "text" | "date" | "tel" | "email";
};

const APPLICANT_INPUTS = [
  { key: "applicantName", label: "성명", placeholder: "예: 홍길동" },
  { key: "birthDate", label: "생년월일", placeholder: "예: 1990.01.01" },
  { key: "address", label: "주소", placeholder: "예: 서울특별시 ○○구 ○○로 00" },
  {
    key: "phone",
    label: "전화번호",
    placeholder: "예: 02-000-0000",
    type: "tel",
  },
  {
    key: "mobilePhone",
    label: "휴대전화번호",
    placeholder: "예: 010-0000-0000",
    type: "tel",
  },
  {
    key: "email",
    label: "전자우편주소",
    placeholder: "예: name@example.com",
    type: "email",
  },
] satisfies InputSpec[];

const ACCOUNT_INPUTS = [
  { key: "financialCompany", label: "금융회사등", placeholder: "예: ○○은행" },
  { key: "branch", label: "개설점포", placeholder: "예: ○○지점" },
  { key: "assetType", label: "자산종류", placeholder: "예: 입출금통장" },
  {
    key: "accountNumber",
    label: "계좌번호 또는 계정정보",
    placeholder: "예: 000-0000-0000",
  },
  { key: "accountHolder", label: "명의인", placeholder: "예: 홍길동" },
  { key: "applicationDate", label: "신청 날짜", placeholder: "", type: "date" },
] satisfies InputSpec[];

type Props = {
  fields: ObjectionFormFields;
  onChange: (key: keyof ObjectionFormFields, value: string) => void;
};

function InputItem({ spec, fields, onChange }: Props & { spec: InputSpec }) {
  return (
    <FormField label={spec.label} htmlFor={spec.key}>
      <input
        id={spec.key}
        type={spec.type ?? "text"}
        value={fields[spec.key]}
        placeholder={spec.placeholder}
        onChange={(event) => onChange(spec.key, event.target.value)}
        className={INPUT_CLASS}
      />
    </FormField>
  );
}

function InputGroup({
  title,
  specs,
  fields,
  onChange,
}: Props & { title: string; specs: InputSpec[] }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 font-semibold text-ink">{title}</legend>
      {specs.map((spec) => (
        <InputItem
          key={spec.key}
          spec={spec}
          fields={fields}
          onChange={onChange}
        />
      ))}
    </fieldset>
  );
}

export function ObjectionFormInputs({ fields, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <InputGroup
        title="신청인"
        specs={APPLICANT_INPUTS}
        fields={fields}
        onChange={onChange}
      />
      <InputGroup
        title="지급정지 계좌등"
        specs={ACCOUNT_INPUTS}
        fields={fields}
        onChange={onChange}
      />
    </div>
  );
}
