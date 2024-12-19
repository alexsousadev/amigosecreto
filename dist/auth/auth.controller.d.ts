import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
declare const authenticateBodySchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
}, {
    email?: string;
    password?: string;
}>;
type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;
export declare class AuthController {
    private jwt;
    private prisma;
    constructor(jwt: JwtService, prisma: PrismaService);
    createSession(body: AuthenticateBodySchema): Promise<{
        access_token: string;
    }>;
}
export {};
