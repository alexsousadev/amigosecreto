"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrupoController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const zod_1 = require("zod");
const jsonwebtoken_1 = require("jsonwebtoken");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const addParticipanteSchema = zod_1.z.object({
    participanteId: zod_1.z.number(),
});
const grupoSchema = zod_1.z.object({
    nome: zod_1.z.string(),
    idCriador: zod_1.z.number(),
    participantes: zod_1.z.array(addParticipanteSchema).optional().default([]),
});
let GrupoController = class GrupoController {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async getGroups() {
        return await this.prisma.grupo.findMany();
    }
    async criarGrupo(body, req) {
        const { nome } = body;
        const decodedToken = await this.decodificarToken(req);
        console.log("\nToken decodificado: ", decodedToken);
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
    async genMatch(req, id) {
        try {
            const decodedToken = this.decodificarToken(req);
            const participantesGrupo = await this.prisma.grupo.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    participantes: true
                }
            });
            const participanteSorteado = this.sortearAmigo(participantesGrupo, decodedToken);
            return { amigo_oculto: participanteSorteado };
        }
        catch (error) {
            console.error("Erro ao decodificar o token: ", error);
            throw new Error('Token inválido');
        }
    }
    async addParticipante(idGrupo, idParticipante, req) {
        if (!this.validarToken(req, idGrupo)) {
            throw new common_1.UnauthorizedException("O grupo não é seu");
        }
        return await this.prisma.grupo.update({
            where: { id: Number(idGrupo) },
            data: {
                participantes: {
                    connect: { id: Number(idParticipante) },
                },
            },
        });
    }
    sortearAmigo(grupo, id) {
        const participantes = grupo.participantes;
        if (participantes.length === 0) {
            throw new Error('Não há participantes para sortear.');
        }
        const randomIndex = Math.floor(Math.random() * participantes.length);
        return participantes[randomIndex];
    }
    decodificarToken(req) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('Token não fornecido');
        }
        try {
            const jwtSecret = this.configService.get('JWT_SECRET');
            const decodedToken = (0, jsonwebtoken_1.verify)(token, jwtSecret);
            return decodedToken;
        }
        catch (error) {
            console.error("Erro ao decodificar o token: ", error);
            throw new Error('Token inválido');
        }
    }
    async deleteGrupo(id, req) {
        return await this.prisma.grupo.delete({
            where: { id: Number(id) },
        });
    }
    async validarToken(req, idGrupo) {
        const decodedToken = this.decodificarToken(req);
        const grupoSelecionado = await this.prisma.grupo.findUnique({
            where: {
                id: Number(idGrupo)
            }
        });
        if (!grupoSelecionado) {
            throw new Error('Grupo não encontrado');
        }
        if (grupoSelecionado.idCriador !== decodedToken.sub) {
            return false;
        }
        return true;
    }
};
exports.GrupoController = GrupoController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GrupoController.prototype, "getGroups", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GrupoController.prototype, "criarGrupo", null);
__decorate([
    (0, common_1.Post)(":id/matches"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GrupoController.prototype, "genMatch", null);
__decorate([
    (0, common_1.Post)(':id/participantes/:idParticipante'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('idParticipante')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], GrupoController.prototype, "addParticipante", null);
__decorate([
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GrupoController.prototype, "decodificarToken", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GrupoController.prototype, "deleteGrupo", null);
__decorate([
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GrupoController.prototype, "validarToken", null);
exports.GrupoController = GrupoController = __decorate([
    (0, common_1.Controller)('grupos'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, config_1.ConfigService])
], GrupoController);
//# sourceMappingURL=grupo.controller.js.map