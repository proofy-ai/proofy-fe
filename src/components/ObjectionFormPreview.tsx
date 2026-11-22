import { ObjectionFormSheet } from "@/components/ObjectionFormSheet";
import { useFittedPreview } from "@/hooks/useFittedPreview";
import { type ObjectionFormFields, PAGE_WIDTH_PX } from "@/lib/objectionForm";

const DARK_MODE_DOCUMENT_FIX = "dark:[filter:invert(1)_hue-rotate(180deg)]";

type Props = {
  fields: ObjectionFormFields;
  reasonText: string;
};

export function ObjectionFormPreview({ fields, reasonText }: Props) {
  const { wrapperRef, contentRef, scale, scaledHeight } = useFittedPreview();

  return (
    <div
      ref={wrapperRef}
      style={{ height: scaledHeight }}
      className={`relative mx-auto w-full max-w-md overflow-hidden rounded-xl border border-brand-line bg-white shadow-sm ${DARK_MODE_DOCUMENT_FIX}`}
    >
      <div
        ref={contentRef}
        style={{
          width: PAGE_WIDTH_PX,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <ObjectionFormSheet fields={fields} reasonText={reasonText} />
      </div>
    </div>
  );
}
