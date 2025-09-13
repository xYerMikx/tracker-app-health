export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/";
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
export const AUTH_SECRET = process.env.AUTH_SECRET || "";
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const DB_URL = process.env.DATABASE_URL || "";

export const PUBLIC_PATHS = [
  "/signin",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/public",
];
