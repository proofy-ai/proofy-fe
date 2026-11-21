/// <reference types="vite/client" />
/// <reference types="msw/vite/client" />

type ImportMetaEnv = {
  readonly VITE_API_ORIGIN: string;
  readonly VITE_USE_MOCK?: string;
};
