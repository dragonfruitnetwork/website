import { DefaultSession } from "next-auth";
import { UserPermissions } from "@prisma/client";

declare module "next-auth" {
    interface Session {
        user?: {
            userPermissions?: UserPermissions;
        } & DefaultSession["user"];
    }
}