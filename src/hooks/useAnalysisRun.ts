import { skipToken, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getAnalysisRun } from "@/api/analysis";
import { getCase } from "@/api/cases";
import { isRunTimedOut, POLL_INTERVAL_MS } from "@/lib/analysisRun";
import { getResultPath } from "@/lib/casePaths";

export const useAnalysisRun = (caseId: string, caseToken: string) => {
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
    if (isSucceeded) navigate(getResultPath(caseId), { replace: true });
  }, [isSucceeded, navigate, caseId]);

  return {
    run,
    isTimedOut: runQuery.data?.isTimedOut ?? false,
    hasNoRun: caseQuery.isSuccess && !runId,
    error: caseQuery.error ?? runQuery.error,
    refetchCase: () => caseQuery.refetch(),
  };
};
