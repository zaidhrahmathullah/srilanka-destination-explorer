import "server-only";

const apiBaseUrl =
  process.env.API_BASE_URL ?? "http://localhost:4000/api";

export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${apiBaseUrl.replace(/\/$/, "")}${normalizedPath}`;
}