import type { ApiErrorBody } from "@/types/api";

const apiOrigin = import.meta.env.VITE_API_ORIGIN ?? "";
const apiBaseUrl = `${apiOrigin}/api/v1`;

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: Record<string, unknown> | null;

  constructor(
    status: number,
    code: string,
    message: string,
    details: Record<string, unknown> | null = null,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  caseToken?: string;
  body?: unknown;
  formData?: FormData;
}

export function resolveApiUrl(path: string): string {
  return path.startsWith("/") ? `${apiOrigin}${path}` : path;
}

function buildRequestInit(options: RequestOptions): RequestInit {
  const headers: Record<string, string> = {};
  if (options.caseToken) headers["X-Case-Token"] = options.caseToken;

  let body: BodyInit | undefined;
  if (options.formData) {
    body = options.formData;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  return { method: options.method ?? "GET", headers, body };
}

async function parseApiError(response: Response): Promise<ApiError> {
  try {
    const errorBody = (await response.json()) as ApiErrorBody;
    const { code, message, details } = errorBody.error;
    return new ApiError(response.status, code, message, details ?? null);
  } catch {
    return new ApiError(
      response.status,
      "INTERNAL",
      "서버 응답을 읽지 못했어요. 잠시 후 다시 시도해 주세요.",
    );
  }
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, buildRequestInit(options));
  } catch {
    throw new ApiError(
      0,
      "NETWORK",
      "서버에 연결하지 못했어요.\n인터넷 연결을 확인해 주세요.",
    );
  }

  if (!response.ok) throw await parseApiError(response);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
