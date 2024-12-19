import { z } from "zod";
export declare const envSchema: z.ZodObject<{
    DATABASE_URL: z.ZodString;
    JWT_SECRET: z.ZodString;
    PORT: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    DATABASE_URL?: string;
    JWT_SECRET?: string;
    PORT?: number;
}, {
    DATABASE_URL?: string;
    JWT_SECRET?: string;
    PORT?: number;
}>;
export type Env = z.infer<typeof envSchema>;
