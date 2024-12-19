import { PrismaService } from 'src/prisma/prisma.service';
import { z } from "zod";
declare const participanteSchema: z.ZodObject<{
    nome: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    nome?: string;
    email?: string;
    password?: string;
}, {
    nome?: string;
    email?: string;
    password?: string;
}>;
type ParticipanteSchema = z.infer<typeof participanteSchema>;
export declare class ParticipanteController {
    private prisma;
    constructor(prisma: PrismaService);
    getParcipantes(): Promise<{
        nome: string;
        email: string;
        id: number;
        passsword: string;
        grupoId: number | null;
    }[]>;
    createParticipante(participante: ParticipanteSchema): Promise<{
        nome: string;
        email: string;
        id: number;
        passsword: string;
        grupoId: number | null;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<void>;
}
export {};
