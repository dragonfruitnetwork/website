import {headers} from "next/headers";
import {auth} from "@/auth";
import {createSafeActionClient} from "next-safe-action";

export const actionClient = createSafeActionClient();
export const adminActionClient = actionClient.use(async ({next}) => {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session?.user || session.user.role !== "admin") {
        throw new Error("UNAUTHORIZED");
    }

    return next({ctx: {user: session.user}});
});
