import type { NextConfig } from "next";

const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
let allowedOrigins: string[] | undefined;

if (authUrl) {
    try {
        allowedOrigins = [new URL(authUrl).host];
    } catch {
        // ignore malformed AUTH_URL — fall back to Next.js same-origin defaults
    }
}

const nextConfig: NextConfig = {
    experimental: allowedOrigins ? { serverActions: { allowedOrigins } } : undefined,
};

export default nextConfig;
