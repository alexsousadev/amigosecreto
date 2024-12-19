import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Env } from "src/env";
import { JwtStrategy } from "./jwt-strategy";
import { AuthController } from "./auth.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            async useFactory(config: ConfigService<Env, true>) {
                // const jwtSecret = await config.get('JWT_SECRET');
                return {
                    secret: config.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: '1h', algorithm: 'HS256'
                    }
                };
            },
        })
    ],
    controllers: [AuthController],
    providers: [JwtStrategy, PrismaService],
})
export class AuthModule { }