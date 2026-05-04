import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
    output: "standalone",
    outputFileTracingIncludes: {
        "/**": ["./prisma/generated/prisma/**/*"],
    },
    reactCompiler: true,
    images: {
        formats: ["image/avif", "image/webp"]
    },
};

export default withSentryConfig(nextConfig, {
    org: "dragonfruit",
    project: "website",
    sentryUrl: process.env.SENTRY_URL,
    authToken: process.env.SENTRY_TOKEN,
    silent: !process.env.CI,
    widenClientFileUpload: true,
});
