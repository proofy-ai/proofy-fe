import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiError } from "@/api/client";

async function loadClient(apiOrigin = "http://api.test") {
  vi.resetModules();
  vi.stubEnv("VITE_API_ORIGIN", apiOrigin);
  return import("@/api/client");
}

async function captureError(action: () => Promise<unknown>) {
  try {
    await action();
  } catch (error) {
    return error as ApiError;
  }
  throw new Error("오류가 발생해야 하는데 발생하지 않았다");
}

function stubFetch(response: Response | Error) {
  const fetchMock = vi.fn(async () => {
    if (response instanceof Error) throw response;
    return response;
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("request", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("정상 JSON 응답을 그대로 돌려준다", async () => {
    const { request } = await loadClient();
    stubFetch(new Response(JSON.stringify({ ok: 1 }), { status: 200 }));

    expect(await request("/health")).toEqual({ ok: 1 });
  });

  it("사건 토큰을 X-Case-Token 헤더로 보내고 API 주소를 앞에 붙인다", async () => {
    const { request } = await loadClient();
    const fetchMock = stubFetch(new Response("{}", { status: 200 }));

    await request("/cases/c1", { caseToken: "tok" });

    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe("http://api.test/api/v1/cases/c1");
    expect((init.headers as Record<string, string>)["X-Case-Token"]).toBe(
      "tok",
    );
  });

  it("본문이 있으면 JSON으로 보낸다", async () => {
    const { request } = await loadClient();
    const fetchMock = stubFetch(new Response("{}", { status: 201 }));

    await request("/cases/sample", {
      method: "POST",
      body: { scenario: "GOODS" },
    });

    const [, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(init.method).toBe("POST");
    expect(init.body).toBe('{"scenario":"GOODS"}');
  });

  it("204 응답은 undefined를 돌려준다", async () => {
    const { request } = await loadClient();
    stubFetch(new Response(null, { status: 204 }));

    expect(await request("/cases/c1", { method: "DELETE" })).toBeUndefined();
  });

  it("오류 응답의 코드와 메시지를 ApiError로 바꾼다", async () => {
    const { request, ApiError } = await loadClient();
    const errorBody = {
      error: { code: "CASE_NOT_FOUND", message: "없음", details: null },
    };
    stubFetch(new Response(JSON.stringify(errorBody), { status: 404 }));

    const error = await captureError(() => request("/cases/x"));

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(404);
    expect(error.code).toBe("CASE_NOT_FOUND");
    expect(error.message).toBe("없음");
  });

  it("JSON이 아닌 오류 응답은 INTERNAL로 바꾼다", async () => {
    const { request } = await loadClient();
    stubFetch(new Response("<html>", { status: 502 }));

    const error = await captureError(() => request("/cases/x"));

    expect(error.status).toBe(502);
    expect(error.code).toBe("INTERNAL");
  });

  it("JSON이 아닌 정상 응답도 ApiError로 바꾼다", async () => {
    const { request, ApiError } = await loadClient();
    stubFetch(new Response("<!doctype html>", { status: 200 }));

    const error = await captureError(() => request("/health"));

    expect(error).toBeInstanceOf(ApiError);
    expect(error.code).toBe("INVALID_RESPONSE");
  });

  it("네트워크가 끊기면 NETWORK 오류로 바꾼다", async () => {
    const { request } = await loadClient();
    stubFetch(new TypeError("fail"));

    const error = await captureError(() => request("/health"));

    expect(error.status).toBe(0);
    expect(error.code).toBe("NETWORK");
  });
});

describe("resolveApiUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("상대 경로에는 API 주소를 붙이고 절대 주소는 그대로 둔다", async () => {
    const { resolveApiUrl } = await loadClient();

    expect(resolveApiUrl("/api/v1/samples/a.png")).toBe(
      "http://api.test/api/v1/samples/a.png",
    );
    expect(resolveApiUrl("https://x.io/a.png")).toBe("https://x.io/a.png");
  });
});
