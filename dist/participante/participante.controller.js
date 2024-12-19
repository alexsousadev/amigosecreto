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
exports.ParticipanteController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const zod_1 = require("zod");
const bcryptjs_1 = require("bcryptjs");
const passport_1 = require("@nestjs/passport");
const participanteSchema = zod_1.z.object({
    nome: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
let ParticipanteController = class ParticipanteController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getParcipantes() {
        return await this.prisma.participante.findMany();
    }
    async createParticipante(participante) {
        const { nome, email, password } = participanteSchema.parse(participante);
        const hashedPassword = await (0, bcryptjs_1.hash)(password, 8);
        return await this.prisma.participante.create({
            data: {
                nome: nome,
                email: email,
                passsword: hashedPassword,
            },
        });
    }
    async login(body) {
        const { email, password } = body;
        if (!email || !password) {
            throw new common_1.BadRequestException('Email e senha são obrigatórios');
        }
        const participante = await this.prisma.participante.findUnique({
            where: { email: email }
        });
        if (!await (0, bcryptjs_1.compare)(password, participante.passsword)) {
            throw new Error("Credenciais inválidas");
        }
        const payload = { email: participante.email, id: participante.id };
    }
};
exports.ParticipanteController = ParticipanteController;
__decorate([
    (0, common_1.Get)("/participantes"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParticipanteController.prototype, "getParcipantes", null);
__decorate([
    (0, common_1.Post)("/registro"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParticipanteController.prototype, "createParticipante", null);
__decorate([
    (0, common_1.Post)("/login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParticipanteController.prototype, "login", null);
exports.ParticipanteController = ParticipanteController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ParticipanteController);
//# sourceMappingURL=participante.controller.js.map