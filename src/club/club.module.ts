import { TypeOrmModule } from '@nestjs/typeorm'
import { Module, forwardRef } from '@nestjs/common'
import { Event, PubSubModule } from '@aarock/api-kit'
import { Club } from './club.entity.js'
import { ClubService } from './club.service.js'
import { ClubResolver } from './club.resolver.js'
import { LeagueModule } from '../league/league.module.js'
/** @kit module.imports */

@Module( {
    imports: [
        PubSubModule,
        TypeOrmModule.forFeature( [
            Club,
            Event,
            /** @kit module.features */
        ] ),
        forwardRef( () => LeagueModule ),
        /** @kit module.services */
    ],
    providers: [
        ClubService,
        ClubResolver,
    ],
    exports: [
        ClubService,
    ]
} )
export class ClubModule { }