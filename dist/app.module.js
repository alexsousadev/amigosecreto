"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const participante_controller_1 = require("./participante/participante.controller");
const grupo_controller_1 = require("./grupo/grupo.controller");
const grupo_module_1 = require("./grupo/grupo.module");
const participante_module_1 = require("./participante/participante.module");
const prisma_service_1 = require("./prisma/prisma.service");
const config_1 = require("@nestjs/config");
const env_1 = require("./env");
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [grupo_module_1.GrupoModule, participante_module_1.ParticipanteModule, config_1.ConfigModule.forRoot({
                validate: (env) => env_1.envSchema.parse(env),
                isGlobal: true,
            }), auth_module_1.AuthModule],
        controllers: [app_controller_1.AppController, participante_controller_1.ParticipanteController, grupo_controller_1.GrupoController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map