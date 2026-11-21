import { request } from "@/api/client";
import type { HealthStatus, SamplesResponse } from "@/types/api";

export const getHealth = () => request<HealthStatus>("/health");

export const getSamples = () => request<SamplesResponse>("/samples");
