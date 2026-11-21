import { useQuery } from "@tanstack/react-query";

import { getHealth, getSamples } from "@/api/meta";
import { selectSampleFiles } from "@/lib/sampleFiles";
import type { InflowType } from "@/types/api";

export const useDemoSamples = (inflowType: InflowType) => {
  const healthQuery = useQuery({ queryKey: ["health"], queryFn: getHealth });
  const samplesQuery = useQuery({ queryKey: ["samples"], queryFn: getSamples });

  return {
    isDemoMode: healthQuery.data?.demoMode ?? false,
    sampleFiles: selectSampleFiles(samplesQuery.data?.items ?? [], inflowType),
  };
};
