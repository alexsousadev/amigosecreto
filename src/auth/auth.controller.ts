import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";

const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthController {

    constructor(private jwt: JwtService, private prisma: PrismaService) { }

    @Post()
    async createSession(@Body() body: AuthenticateBodySchema) {
        const { email, password } = authenticateBodySchema.parse(body);

        const participante = await this.prisma.participante.findUnique({
            where: { email }
        })

        if (!participante) {
            throw new UnauthorizedException("Email ou senha inválidos")
        }

        const passwordMatch = await compare(password, participante.passsword);

        if (!passwordMatch) {
            throw new UnauthorizedException("Email ou senha inválidos")
        }

        const accessToken = this.jwt.sign({ sub: String(participante.id) })

        return {
            access_token: accessToken
        };
    }
}