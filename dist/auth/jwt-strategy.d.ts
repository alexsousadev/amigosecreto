import { ConfigService } from "@nestjs/config";
import { Env } from "src/env";
import { z } from "zod";
declare const tokenSchema: z.ZodObject<{
    sub: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sub?: string;
}, {
    sub?: string;
}>;
type TokenSchema = z.infer<typeof tokenSchema>;
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(config: ConfigService<Env, true>);
    validate(payload: TokenSchema): Promise<{
        sub?: string;
    }>;
}
export {};
