import { Env } from 'src/env';
import { Controller, Post, Body, Param, Get, Request, Headers, UseGuards, Delete, UnauthorizedException, InternalServerErrorException, Req } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from "zod";
import { verify } from 'jsonwebtoken';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

const addParticipanteSchema = z.object({
    participanteId: z.number(),
});

const grupoSchema = z.object({
    nome: z.string(),
    idCriador: z.number(),
    participantes: z.array(addParticipanteSchema).optional().default([]),
});

type GrupoSchema = z.infer<typeof grupoSchema>;

@Controller('grupos')
export class GrupoController {
    constructor(private prisma: PrismaService, private configService: ConfigService<Env, true>) { }


    @Get()
    async getGroups() {
        return await this.prisma.grupo.findMany()
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async criarGrupo(@Body() body: GrupoSchema, @Request() req: ExpressRequest) {
        const { nome } = body
        const decodedToken = await this.decodificarToken(req)

        console.log("\nToken decodificado: ", decodedToken)
        // Cria um novo grupo
        return await this.prisma.grupo.create({
            data: {
                nome: nome,
                idCriador: {
                    connect: { id: Number(decodedToken.sub) }
                },
                participantes: {
                    connect: [],
                },
            },
        });
    }

    @Post(":id/matches")
    @UseGuards(AuthGuard('jwt'))
    async genMatch(@Request() req: ExpressRequest, @Param('id') id: string) {

        try {
            const decodedToken = this.decodificarToken(req)

            const participantesGrupo = await this.prisma.grupo.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    participantes: true
                }
            });

            const participanteSorteado = this.sortearAmigo(participantesGrupo, decodedToken);


            return { amigo_oculto: participanteSorteado }
        } catch (error) {
            console.error("Erro ao decodificar o token: ", error);
            throw new Error('Token inválido');
        }
    }


    @Post(':id/participantes/:idParticipante')
    async addParticipante(@Param('id') idGrupo: string, @Param('idParticipante') idParticipante: string, @Request() req: ExpressRequest) {

        if (!this.validarToken(req, idGrupo)) {
            throw new UnauthorizedException("O grupo não é seu")
        }

        // Adiciona o participante ao grupo
        return await this.prisma.grupo.update({
            where: { id: Number(idGrupo) },
            data: {
                participantes: {
                    connect: { id: Number(idParticipante) },
                },
            },
        });
    }


    sortearAmigo(grupo: { nome: string, participantes: any[] }, id: number) {
        const participantes = grupo.participantes;

        if (participantes.length === 0) {
            throw new Error('Não há participantes para sortear.');
        }

        const randomIndex = Math.floor(Math.random() * participantes.length);
        return participantes[randomIndex];
    }

    decodificarToken(@Request() req: ExpressRequest) {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new Error('Token não fornecido');
        }

        try {
            const jwtSecret = this.configService.get('JWT_SECRET');
            const decodedToken = verify(token, jwtSecret);
            return decodedToken;
        } catch (error) {
            console.error("Erro ao decodificar o token: ", error);
            throw new Error('Token inválido');
        }
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async deleteGrupo(@Param('id') id: string, @Request() req: ExpressRequest) {
        return await this.prisma.grupo.delete({
            where: { id: Number(id) },
        });
    }

    async validarToken(@Request() req: ExpressRequest, idGrupo: string) {
        const decodedToken = this.decodificarToken(req)

        const grupoSelecionado: GrupoSchema = await this.prisma.grupo.findUnique({
            where: {
                id: Number(idGrupo)
            }
        })

        // Verifica se o grupo foi encontrado
        if (!grupoSelecionado) {
            throw new Error('Grupo não encontrado');
        }

        // Verifica se o criador do grupo é o mesmo que o token decodificado
        if (grupoSelecionado.idCriador !== decodedToken.sub) {
            return false; // Retorna false se não for o criador
        }

        return true; // Retorna true se for o criador
    }
}
