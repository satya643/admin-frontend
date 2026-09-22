const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");
