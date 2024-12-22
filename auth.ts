import NextAuth from "next-auth";
import Google from "@auth/core/providers/google";

import {prisma} from "@/prisma";
import {Provider} from "@auth/core/providers";
import {PrismaAdapter} from "@auth/prisma-adapter";

const providers: Provider[] = [];

if (process.env.AUTH_HINA_ID?.length) {
    providers.push({
        id: "hina",
        type: "oidc",
        idToken: false,
        name: "DragonFruit",
        issuer: "https://id.dragonfruit.network",
        clientId: process.env.AUTH_HINA_ID,
        clientSecret: process.env.AUTH_HINA_SECRET,
        authorization: {
            params: {
                scope: "openid profile dragonfruit_email"
            }
        },
        style: {
            logo: "/dragonfruit.png",
            brandColor: "#880ED4"
        },
        account() {
        },
        async profile(profile) {
            return {
                id: profile.sub,
                name: profile.name,
                image: profile.picture,
                email: profile.dragonfruit_email
            };
        }
    });
} else if (process.env.AUTH_GOOGLE_ID?.length) {
    providers.push(Google({
        account() {
        }
    }));
} else {
    console.error("No OAuth providers configured. Any authentication requests will fail.");
}

export const {handlers, signIn, signOut, auth} = NextAuth({
    providers,
    adapter: PrismaAdapter(prisma),
    theme: {
        logo: "/dragonfruit.png",
        brandColor: "#663bb9",
        colorScheme: "dark"
    },
    session: {
        maxAge: 1209600
    },
    cookies: {
        sessionToken: {
            name: "dragonfruit-session",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/"
            }
        },
        csrfToken: {
            name: "dragonfruit-csrf"
        },
        callbackUrl: {
            name: "dragonfruit-cburl"
        }
    },
    callbacks: {
        async session({session, user}) {
            return session;
        }
    }
});
