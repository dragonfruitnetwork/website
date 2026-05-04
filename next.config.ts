import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const securityHeaders = [
    {key: "X-Content-Type-Options", value: "nosniff"},
    {key: "X-Frame-Options", value: "SAMEORIGIN"},
    {key: "Referrer-Policy", value: "strict-origin-when-cross-origin"}
];

const noIndexHeader = [
    {key: "X-Robots-Tag", value: "noindex, nofollow"}
];

const nextConfig: NextConfig = {
    output: "standalone",
    outputFileTracingIncludes: {
        "/**": ["./prisma/generated/prisma/**/*"],
    },
    reactCompiler: true,
    images: {
        formats: ["image/avif", "image/webp"]
    },
    async headers() {
        return [
            {source: "/:path*", headers: securityHeaders},
            {source: "/api/:path*", headers: noIndexHeader},
            {source: "/admin/:path*", headers: noIndexHeader}
        ];
    }
};

export default withSentryConfig(nextConfig, {
    org: "dragonfruit",
    project: "website",
    sentryUrl: process.env.SENTRY_URL,
    authToken: process.env.SENTRY_TOKEN,
    silent: !process.env.CI,
});
