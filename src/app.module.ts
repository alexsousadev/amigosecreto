import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParticipanteController } from './participante/participante.controller';
import { GrupoController } from './grupo/grupo.controller';
import { GrupoModule } from './grupo/grupo.module';
import { ParticipanteModule } from './participante/participante.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [GrupoModule, ParticipanteModule, ConfigModule.forRoot({
    validate: (env) => envSchema.parse(env),
    isGlobal: true,
  }), AuthModule],
  controllers: [AppController, ParticipanteController, GrupoController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
