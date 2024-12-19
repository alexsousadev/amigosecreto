import { Controller, Get, Post, Body, BadRequestException, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from "zod";
import { compare, hash } from "bcryptjs"
import { AuthGuard } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';

const participanteSchema = z.object({
    nome: z.string(),
    email: z.string().email(),
    password: z.string(),
});

type ParticipanteSchema = z.infer<typeof participanteSchema>;

@Controller()
export class ParticipanteController {

    constructor(private prisma: PrismaService) { }

    @Get("/participantes")
    @UseGuards(AuthGuard('jwt'))
    async getParcipantes() {
        return await this.prisma.participante.findMany();
    }

    @Post("/registro")
    async createParticipante(@Body() participante: ParticipanteSchema) {

        const { nome, email, password } = participanteSchema.parse(participante);


        const hashedPassword = await hash(password, 8);

        return await this.prisma.participante.create({
            data: {
                nome: nome,
                email: email,
                passsword: hashedPassword,
            },
        });
    }

    @Post("/login")
    async login(@Body() body: { email: string; password: string }) {

        const { email, password } = body;

        if (!email || !password) {
            throw new BadRequestException('Email e senha são obrigatórios');
        }

        // buscando conta
        const participante = await this.prisma.participante.findUnique({
            where: { email: email }
        })

        // verificando a senha
        if (!await compare(password, participante.passsword)) {
            throw new Error("Credenciais inválidas")
        }

        const payload = { email: participante.email, id: participante.id }


        
    }
}