import { skipToken, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getAnalysisRun } from "@/api/analysis";
import { getCase } from "@/api/cases";
import {
  type AfterAnalysis,
  isRunTimedOut,
  POLL_INTERVAL_MS,
} from "@/lib/analysisRun";
import { getChatPath, getResultPath } from "@/lib/casePaths";

export const useAnalysisRun = (
  caseId: string,
  caseToken: string,
  afterAnalysis: AfterAnalysis,
) => {
  const navigate = useNavigate();
  const caseQuery = useQuery({
    queryKey: ["case", caseId],
    queryFn: () => getCase(caseId, caseToken),
    retry: false,
  });
  const runId = caseQuery.data?.case.latestRun?.runId;

  const runQuery = useQuery({
    queryKey: ["analysis-run", caseId, runId],
    queryFn: runId ? () => getAnalysisRun(caseId, caseToken, runId) : skipToken,
    refetchInterval: (query) => {
      const run = query.state.data;
      if (run?.status !== "RUNNING") return false;
      return isRunTimedOut(run.startedAt, Date.now())
        ? false
        : POLL_INTERVAL_MS;
    },
    select: (run) => ({
      run,
      isTimedOut:
        run.status === "RUNNING" && isRunTimedOut(run.startedAt, Date.now()),
    }),
  });

  const run = runQuery.data?.run;
  const isSucceeded = run?.status === "SUCCEEDED";

  useEffect(() => {
    if (!isSucceeded) return;
    const nextPath =
      afterAnalysis === "result" ? getResultPath(caseId) : getChatPath(caseId);
    navigate(nextPath, { replace: true });
  }, [isSucceeded, navigate, caseId, afterAnalysis]);

  return {
    run,
    isTimedOut: runQuery.data?.isTimedOut ?? false,
    hasNoRun: caseQuery.isSuccess && !runId,
    error: caseQuery.error ?? runQuery.error,
    refetchCase: () => caseQuery.refetch(),
  };
};
