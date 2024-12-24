import {auth} from "@/auth";
import {UserPermissions} from "@prisma/client";
import {createSafeActionClient} from "next-safe-action";

export const actionClient = createSafeActionClient();
export const adminActionClient = actionClient.use(async ({next}) => {
    const session = await auth();

    if (session?.user?.userPermissions !== UserPermissions.ADMIN) {
        throw new Error("UNAUTHORIZED");
    }

    return next({ctx: {user: session.user}});
});
