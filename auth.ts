import * as Sentry from "@sentry/nextjs";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "@/prisma";

export const auth = betterAuth({
    baseURL: process.env.AUTH_URL ?? process.env.NEXTAUTH_URL,
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    logger: {
        log: (level, message, ...args) => {
            if (level !== "error" && level !== "warn") return;

            const sentryLevel = level === "error" ? "error" : "warning";
            const errorArg = args.find((a): a is Error => a instanceof Error);

            if (errorArg) {
                Sentry.captureException(errorArg, {
                    level: sentryLevel,
                    extra: { betterAuthMessage: message, args },
                });
            } else {
                Sentry.captureMessage(message, {
                    level: sentryLevel,
                    extra: { args },
                });
            }
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.AUTH_GOOGLE_ID ?? "",
            clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 14,
    },
    advanced: {
        cookiePrefix: "dragonfruit",
        cookies: {
            session_token: { name: "dragonfruit-session" },
        },
    },
    plugins: [admin(), nextCookies()],
});
