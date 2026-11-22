import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ChatFinishBar } from "@/components/ChatFinishBar";
import { ChatInputBar } from "@/components/ChatInputBar";
import { ChatThread } from "@/components/ChatThread";
import { useChatFlow } from "@/hooks/useChatFlow";
import { useChatReveal } from "@/hooks/useChatReveal";
import { useReanalysisWithAnswers } from "@/hooks/useReanalysisWithAnswers";
import { getResultPath } from "@/lib/casePaths";
import { buildChatItems } from "@/lib/chatItems";
import { getDemoAnswer } from "@/lib/demoAnswers";
import { useSessionStore } from "@/store/sessionStore";
import type { AgentQuestion } from "@/types/api";

type Props = {
  caseId: string;
  caseToken: string;
  questions: AgentQuestion[];
};

export function ChatView({ caseId, caseToken, questions }: Props) {
  const navigate = useNavigate();
  const trialScenario = useSessionStore((state) => state.trialScenario);
  const flow = useChatFlow(questions);
  const reanalysis = useReanalysisWithAnswers(caseId, caseToken);
  const hasAnswers = flow.answerInputs.length > 0;
  const items = buildChatItems(questions, flow.turns, hasAnswers);
  const reveal = useChatReveal(items);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [reveal.visibleItems.length, reveal.isTyping]);

  const handleFinish = () =>
    hasAnswers
      ? reanalysis.reanalyze(flow.answerInputs)
      : navigate(getResultPath(caseId));

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <ChatThread items={reveal.visibleItems} isTyping={reveal.isTyping} />
      {reveal.isAllVisible && flow.currentQuestion && (
        <ChatInputBar
          key={flow.currentQuestion.questionId}
          defaultValue={getDemoAnswer(trialScenario, flow.turns.length)}
          onSend={flow.send}
          onSkip={flow.skip}
        />
      )}
      {reveal.isAllVisible && !flow.currentQuestion && (
        <ChatFinishBar
          hasAnswers={hasAnswers}
          isPending={reanalysis.isPending}
          errorMessage={reanalysis.errorMessage}
          onFinish={handleFinish}
        />
      )}
      <div ref={endRef} />
    </div>
  );
}
