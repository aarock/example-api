//@ts-nocheck
import { configure } from '@aarock/flake'
import { Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { ApiKitModule } from '@aarock/api-kit'
import { LeagueModule } from './league/league.module.js'
import { ClubModule } from './club/club.module.js'
/** @kit main.imports */

@Module( {
    imports: [
        ConfigModule.forRoot( { isGlobal: true } ),
        ApiKitModule.forRoot( { } ),
        LeagueModule,
        ClubModule,
        /** @kit main.services */
    ]
} )
class AppModule { }

configure( 1 )
const app = await NestFactory.create( AppModule )
await app.listen( process.env.PORT || 8080 )