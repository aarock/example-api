import { EntityManager, In, Repository, Relation } from 'typeorm'
import { Event, Collection, PUBSUB_TOKEN, IPubSub } from "@aarock/api-kit"
import { Inject, Injectable, Optional, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Token } from '@aarock/token'
import { League } from './league.entity.js'
import { LeagueInput } from './league.input.js'
import { LeagueFilter } from './league.filter.js'
import { Club } from '../club/club.entity.js'
import { ClubService } from '../club/club.service.js'
/** @kit service.imports */
import DataLoader from 'dataloader'

@Injectable()
export class LeagueService extends Collection<League> {

    override normalizer = LeagueInput
    override filterer = LeagueFilter

    constructor (
        @InjectRepository( League ) protected readonly repository: Repository<League>,
        @InjectRepository( Event ) @Optional() protected readonly eventRepository?: Repository<Event>,
        @Inject( PUBSUB_TOKEN ) @Optional() protected readonly pubSub?: IPubSub,
        @Inject( forwardRef( () => ClubService ) ) protected readonly clubService?: Relation<ClubService>,
        /** @kit service.services */
    ) { super() }

    protected dataloader = new DataLoader( async ( partials: Partial<League>[] ): Promise<League[]> => {
        const ids: Array<League[ 'id' ]> = partials.map( idPartial => idPartial.id ).filter( id => !!id )
        const where = { id: In( ids ) } as any /** @see https://github.com/typeorm/typeorm/issues/8939 */
        let list = await this.repository.find( { where } )
        const map = list.reduce( ( acc, entity ) => acc.set( entity.id, entity ), new Map<string, League>() )
        return partials.map( entity => map.get( entity.id ) )
    }, { cache: false } );

    protected clubsDataLoader = new DataLoader( async ( partials: Partial<League>[] ): Promise<Club[][]> => {
        const ids: Array<League[ 'id' ]> = partials.map( idPartial => idPartial.id ).filter( id => !!id )
        const where = { id: In( ids ) } as any /** @see https://github.com/typeorm/typeorm/issues/8939 */
        const list = await this.repository.find( { where, relations: [ 'clubs' ] } )
        const map = list.reduce( ( acc, entity ) => acc.set( entity.id, entity.clubs ), new Map<string, Club[]>() )
        return partials.map( entity => map.get( entity.id ) )
    }, { cache: false } );

    public async clubs ( partial: Partial<League> ): Promise<Club[]> {
        return await this.clubsDataLoader.load( partial )
    }

    /** @kit service.dataloaders */

    public async preSave ( input: LeagueInput, token?: Token, trx?: EntityManager ): Promise<void> {

        /** @kit service.presavers */
        
        delete input.clubs
        
        /** @kit service.predelete */
    }

    public async postSave ( output: LeagueInput, token?: Token, trx?: EntityManager ): Promise<void> {

        if ( !!output.clubs ) {
            output.clubs.forEach( clubInput => clubInput.league = { id: output.id } )
            await Promise.all( output.clubs.map( clubInput => this.clubService?.mutate( clubInput, token, trx ) ) )
        }
        /** @kit service.postsavers */
    }

}