import { config as loadDotenv } from "dotenv";
import { defineConfig } from "prisma/config";

loadDotenv({ path: ".env" });
loadDotenv({ path: ".env.local", override: true });

export default defineConfig({
    schema: "prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: process.env.DATABASE_URL ?? "",
    },
});
