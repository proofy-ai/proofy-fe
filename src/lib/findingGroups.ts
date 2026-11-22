import type { Finding, FindingStatus } from "@/types/api";

const NEEDS_CHECK_ORDER: FindingStatus[] = [
  "CONFLICT",
  "STATEMENT_ONLY",
  "UNKNOWN",
];

export const groupFindingsByAttention = (findings: Finding[]) => {
  const matched = findings.filter((finding) => finding.status === "MATCH");
  const needsCheck = NEEDS_CHECK_ORDER.flatMap((status) =>
    findings.filter((finding) => finding.status === status),
  );
  return { needsCheck, matched };
};

const STATUS_DISPLAY_ORDER: FindingStatus[] = [
  "CONFLICT",
  "STATEMENT_ONLY",
  "UNKNOWN",
  "MATCH",
];

export const countFindingsByStatus = (findings: Finding[]) =>
  STATUS_DISPLAY_ORDER.flatMap((status) => {
    const count = findings.filter(
      (finding) => finding.status === status,
    ).length;
    return count > 0 ? [{ status, count }] : [];
  });
