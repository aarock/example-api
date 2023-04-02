import { TypeOrmModule } from '@nestjs/typeorm'
import { Module, forwardRef } from '@nestjs/common'
import { Event, PubSubModule } from '@aarock/api-kit'
import { League } from './league.entity.js'
import { LeagueService } from './league.service.js'
import { LeagueResolver } from './league.resolver.js'
import { ClubModule } from '../club/club.module.js'
/** @kit module.imports */

@Module( {
    imports: [
        PubSubModule,
        TypeOrmModule.forFeature( [
            League,
            Event,
            /** @kit module.features */
        ] ),
        forwardRef( () => ClubModule ),
        /** @kit module.services */
    ],
    providers: [
        LeagueService,
        LeagueResolver,
    ],
    exports: [
        LeagueService,
    ]
} )
export class LeagueModule { }