import type { ReactNode } from "react";
import { useState } from "react";

import Button from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";
import GlassCard from "@/components/common/GlassCard";
import GradientButton from "@/components/common/GradientButton";
import InfoTooltip from "@/components/common/InfoTooltip";
import Toggle from "@/components/common/Toggle";
import DeadlineBadge from "@/components/DeadlineBadge";
import EvidenceUploader from "@/components/EvidenceUploader";
import StageProgressList from "@/components/StageProgressList";
import { EmptyState, ErrorState, LoadingState } from "@/components/StateViews";
import {
  AnalysisRequiredBadge,
  ChecklistStatusBadge,
  ConfirmedBadge,
  NeedsCheckBadge,
} from "@/components/StatusBadge";
import { useSettingStore } from "@/store/settingStore";
import { useToastStore } from "@/store/toastStore";
import type { Deadline, DeadlineState, StageProgress } from "@/types/api";

const deadlineSamples: Record<DeadlineState, Deadline> = {
  OK: {
    state: "OK",
    deadlineDate: "2027-01-17",
    daysLeft: 57,
    label: "D-57",
    basis: "",
    notice: "",
  },
  URGENT: {
    state: "URGENT",
    deadlineDate: "2026-11-25",
    daysLeft: 4,
    label: "D-4",
    basis: "",
    notice: "",
  },
  EXPIRED: {
    state: "EXPIRED",
    deadlineDate: "2026-11-01",
    daysLeft: -20,
    label: "기한 지남",
    basis: "",
    notice: "",
  },
  UNKNOWN_NOTICE_DATE: {
    state: "UNKNOWN_NOTICE_DATE",
    deadlineDate: null,
    daysLeft: null,
    label: "공고일 확인 필요",
    basis: "",
    notice: "",
  },
};

const stageSamples: StageProgress[] = [
  { key: "EXTRACTING", label: "글자 읽는 중", status: "DONE" },
  { key: "COMPARING", label: "거래내역과 대조 중", status: "RUNNING" },
  { key: "DRAFTING", label: "초안 작성 중", status: "PENDING" },
  { key: "FINISHED", label: "실패한 단계 예시", status: "FAILED" },
];

function GallerySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <div className="rounded-2xl bg-white/60 p-4">{children}</div>
    </section>
  );
}

export default function ComponentGallery() {
  const [uploadedNames, setUploadedNames] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToggleOn, setIsToggleOn] = useState(false);
  const darkMode = useSettingStore((state) => state.darkMode);
  const setDarkMode = useSettingStore((state) => state.setDarkMode);
  const largeTextMode = useSettingStore((state) => state.largeTextMode);
  const setLargeTextMode = useSettingStore((state) => state.setLargeTextMode);
  const showToast = useToastStore((state) => state.show);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-ink">컴포넌트 모아 보기</h1>

      <GallerySection title="화면 설정">
        <div className="flex flex-wrap items-center gap-6 text-sm text-ink">
          <label className="flex items-center gap-2">
            다크 모드
            <Toggle
              checked={darkMode}
              onChange={setDarkMode}
              aria-label="다크 모드"
            />
          </label>
          <label className="flex items-center gap-2">
            큰글씨 모드
            <Toggle
              checked={largeTextMode}
              onChange={setLargeTextMode}
              aria-label="큰글씨 모드"
            />
          </label>
        </div>
      </GallerySection>

      <GallerySection title="기한 배지(DeadlineBadge)">
        <div className="flex flex-wrap gap-2">
          {Object.values(deadlineSamples).map((deadline) => (
            <DeadlineBadge key={deadline.state} deadline={deadline} />
          ))}
        </div>
      </GallerySection>

      <GallerySection title="상태 배지(StatusBadge)">
        <div className="flex flex-wrap gap-2">
          <AnalysisRequiredBadge />
          <ChecklistStatusBadge status="SATISFIED" />
          <ChecklistStatusBadge status="MISSING" />
          <ChecklistStatusBadge status="NOT_COLLECTED" />
          <ChecklistStatusBadge status="GUIDE_ONLY" />
          <NeedsCheckBadge />
          <ConfirmedBadge />
        </div>
      </GallerySection>

      <GallerySection title="단계 표시(StageProgressList)">
        <StageProgressList stages={stageSamples} />
      </GallerySection>

      <GallerySection title="서류 업로더(EvidenceUploader, 6/8개 상태)">
        <EvidenceUploader
          evidenceCount={6}
          onFilesAccepted={(files) =>
            setUploadedNames(files.map((file) => file.name))
          }
        />
        <p className="mt-2 text-sm text-ink-sub">
          받아들인 파일: {uploadedNames.join(", ") || "없음"}
        </p>
      </GallerySection>

      <GallerySection title="상태 화면(StateViews)">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EmptyState
            title="진행 중인 사건이 없어요"
            description="체험 계정으로 시작해 볼까요?"
          />
          <ErrorState
            message={"서버에 연결하지 못했어요.\n인터넷 연결을 확인해 주세요."}
            onRetry={() => showToast("다시 시도를 눌렀어요", "info")}
          />
          <ErrorState
            message={"서버 응답을 읽지 못했어요.\n잠시 후 다시 시도해 주세요."}
            onRetry={() => showToast("다시 시도를 눌렀어요", "info")}
          />
          <LoadingState />
        </div>
      </GallerySection>

      <GallerySection title="버튼과 토글">
        <div className="flex flex-wrap items-center gap-4">
          <GradientButton onClick={() => showToast("눌렀어요")}>
            그라데이션 버튼
          </GradientButton>
          <GradientButton disabled>비활성</GradientButton>
          <Button onClick={() => showToast("눌렀어요")}>기본 버튼</Button>
          <Toggle
            checked={isToggleOn}
            onChange={setIsToggleOn}
            aria-label="토글 예시"
          />
        </div>
      </GallerySection>

      <GallerySection title="카드, 툴팁, 토스트, 확인창">
        <div className="flex flex-col gap-4">
          <GlassCard title="글래스 카드">
            <p className="text-sm text-ink-sub">카드 안 내용 예시입니다.</p>
          </GlassCard>
          <div className="flex items-center gap-2 text-sm text-ink">
            도움말 툴팁
            <InfoTooltip text="마우스를 올리면 설명이 보여요." />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => showToast("저장했어요", "success")}>
              성공 토스트
            </Button>
            <Button onClick={() => showToast("문제가 생겼어요", "error")}>
              오류 토스트
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>확인창 열기</Button>
          </div>
        </div>
      </GallerySection>

      <ConfirmModal
        isOpen={isModalOpen}
        message="아직 확인하지 않은 문장이 2개 있어요. 그래도 복사할까요?"
        confirmText="그래도 복사"
        cancelText="문장으로 이동"
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => setIsModalOpen(false)}
      />
    </div>
  );
}
