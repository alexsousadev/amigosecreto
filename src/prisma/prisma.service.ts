import { PrismaClient } from "@prisma/client"

export class PrismaService extends PrismaClient {

    public client: PrismaClient

    constructor() {
        super()
    }


    onModuleInit() {
        this.$connect()
    }

    onModuleDestroy() {
        this.$disconnect()
    }
}