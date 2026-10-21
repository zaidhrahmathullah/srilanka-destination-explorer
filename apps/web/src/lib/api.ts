const SERVER_API_BASE_URL =
  process.env.BACKEND_API_URL ??
  "http://localhost:4000/api";

export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  const baseUrl =
    typeof window === "undefined"
      ? SERVER_API_BASE_URL
      : "/api";

  return `${baseUrl.replace(/\/$/, "")}${normalizedPath}`;
}

export async function apiRequest(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  return fetch(getApiUrl(path), {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
}