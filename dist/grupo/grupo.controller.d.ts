import { Env } from 'src/env';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from "zod";
import { Request as ExpressRequest } from 'express';
import { ConfigService } from '@nestjs/config';
declare const grupoSchema: z.ZodObject<{
    nome: z.ZodString;
    idCriador: z.ZodNumber;
    participantes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        participanteId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        participanteId?: number;
    }, {
        participanteId?: number;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    nome?: string;
    participantes?: {
        participanteId?: number;
    }[];
    idCriador?: number;
}, {
    nome?: string;
    participantes?: {
        participanteId?: number;
    }[];
    idCriador?: number;
}>;
type GrupoSchema = z.infer<typeof grupoSchema>;
export declare class GrupoController {
    private prisma;
    private configService;
    constructor(prisma: PrismaService, configService: ConfigService<Env, true>);
    getGroups(): Promise<{
        id: number;
        nome: string;
        participanteId: number;
    }[]>;
    criarGrupo(body: GrupoSchema, req: ExpressRequest): Promise<{
        id: number;
        nome: string;
        participanteId: number;
    }>;
    genMatch(req: ExpressRequest, id: string): Promise<{
        amigo_oculto: any;
    }>;
    addParticipante(idGrupo: string, idParticipante: string, req: ExpressRequest): Promise<{
        id: number;
        nome: string;
        participanteId: number;
    }>;
    sortearAmigo(grupo: {
        nome: string;
        participantes: any[];
    }, id: number): any;
    decodificarToken(req: ExpressRequest): any;
    deleteGrupo(id: string, req: ExpressRequest): Promise<{
        id: number;
        nome: string;
        participanteId: number;
    }>;
    validarToken(req: ExpressRequest, idGrupo: string): Promise<boolean>;
}
export {};
