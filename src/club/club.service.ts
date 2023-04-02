import { EntityManager, In, Repository, Relation } from 'typeorm'
import { Event, Collection, PUBSUB_TOKEN, IPubSub } from "@aarock/api-kit"
import { Inject, Injectable, Optional, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Token } from '@aarock/token'
import { Club } from './club.entity.js'
import { ClubInput } from './club.input.js'
import { ClubFilter } from './club.filter.js'
import { League } from '../league/league.entity.js'
import { LeagueService } from '../league/league.service.js'
/** @kit service.imports */
import DataLoader from 'dataloader'

@Injectable()
export class ClubService extends Collection<Club> {

    override normalizer = ClubInput
    override filterer = ClubFilter

    constructor (
        @InjectRepository( Club ) protected readonly repository: Repository<Club>,
        @InjectRepository( Event ) @Optional() protected readonly eventRepository?: Repository<Event>,
        @Inject( PUBSUB_TOKEN ) @Optional() protected readonly pubSub?: IPubSub,
        @Inject( forwardRef( () => LeagueService ) ) protected readonly leagueService?: Relation<LeagueService>,
        /** @kit service.services */
    ) { super() }

    protected dataloader = new DataLoader( async ( partials: Partial<Club>[] ): Promise<Club[]> => {
        const ids: Array<Club[ 'id' ]> = partials.map( idPartial => idPartial.id ).filter( id => !!id )
        const where = { id: In( ids ) } as any /** @see https://github.com/typeorm/typeorm/issues/8939 */
        let list = await this.repository.find( { where } )
        const map = list.reduce( ( acc, entity ) => acc.set( entity.id, entity ), new Map<string, Club>() )
        return partials.map( entity => map.get( entity.id ) )
    }, { cache: false } );

    protected leagueDataLoader = new DataLoader( async ( partials: Partial<Club>[] ): Promise<League[]> => {
        const ids: Array<Club[ 'id' ]> = partials.map( idPartial => idPartial.id ).filter( id => !!id )
        const where = { id: In( ids ) } as any /** @see https://github.com/typeorm/typeorm/issues/8939 */
        const list = await this.repository.find( { where, relations: [ 'league' ] } )
        const map = list.reduce( ( acc, entity ) => acc.set( entity.id, entity.league ), new Map<string, League>() )
        return partials.map( entity => map.get( entity.id ) )
    }, { cache: false } );

    public async league ( partial: Partial<Club> ): Promise<League> {
        return await this.leagueDataLoader.load( partial )
    }

    /** @kit service.dataloaders */

    public async preSave ( input: ClubInput, token?: Token, trx?: EntityManager ): Promise<void> {

        if ( !!input.league ) {
            const event = await this.leagueService?.mutate( input.league, token, trx )
            input.league = { id: event.sourceId }
        }

        /** @kit service.presavers */
        /** @kit service.predelete */
    }

    public async postSave ( output: ClubInput, token?: Token, trx?: EntityManager ): Promise<void> {

        /** @kit service.postsavers */
    }

}