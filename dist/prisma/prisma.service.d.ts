import { PrismaClient } from "@prisma/client";
export declare class PrismaService extends PrismaClient {
    client: PrismaClient;
    constructor();
    onModuleInit(): void;
    onModuleDestroy(): void;
}
