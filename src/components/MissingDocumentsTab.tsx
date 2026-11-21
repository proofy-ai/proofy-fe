import { useNavigate } from "react-router-dom";

import { ChecklistSection } from "@/components/ChecklistSection";
import { Button } from "@/components/common/Button";
import { Toggle } from "@/components/common/Toggle";
import { useChecklistCheck } from "@/hooks/useChecklistCheck";
import { getEvidencePath } from "@/lib/casePaths";
import type { Checklist } from "@/types/api";

type Props = {
  caseId: string;
  caseToken: string;
  checklist: Checklist;
};

export function MissingDocumentsTab({ caseId, caseToken, checklist }: Props) {
  const navigate = useNavigate();
  const { setChecked, pendingItemId } = useChecklistCheck(caseId, caseToken);

  return (
    <div className="flex flex-col gap-4">
      <p className="break-keep text-sm text-ink-sub">
        {checklist.missingCount > 0
          ? `아직 준비하지 않은 서류가 ${checklist.missingCount}개 있어요.`
          : "빠진 서류가 없어요."}
      </p>
      <ChecklistSection
        checklist={checklist}
        renderAction={(item) =>
          item.status === "MISSING" && (
            <div className="ml-auto flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-ink">
                {pendingItemId === item.itemId ? "저장 중…" : "따로 준비했어요"}
                <Toggle
                  size="sm"
                  checked={item.checked}
                  disabled={pendingItemId === item.itemId}
                  aria-label={`${item.label} 따로 준비했어요`}
                  onChange={(checked) => setChecked(item.itemId, checked)}
                />
              </div>
            </div>
          )
        }
      />
      <Button fullWidth onClick={() => navigate(getEvidencePath(caseId))}>
        서류 올리고 다시 분석하기
      </Button>
    </div>
  );
}
