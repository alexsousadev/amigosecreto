import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport"
import { Strategy, ExtractJwt } from "passport-jwt";
import { Env } from "src/env";
import { z } from "zod";

const tokenSchema = z.object({
    sub: z.string()
})

type TokenSchema = z.infer<typeof tokenSchema>

@Injectable() // toda classe provider tem que ter isso
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(config: ConfigService<Env, true>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_SECRET'),
            algorithms: ['HS256']
        });
    }


    async validate(payload: TokenSchema) {
        return tokenSchema.parse(payload);
    }

}