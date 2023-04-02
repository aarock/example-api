import { AuthGuard, ScopeGuard, Event, Repeater, IEdge } from "@aarock/api-kit"
import { Resolver, Query, Args, Mutation, Context, ID, Int, ResolveField, Parent } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { Token } from '@aarock/token'
import { League } from './league.entity.js'
import { LeagueEdge } from './league.edge.js'
import { LeagueFilter } from './league.filter.js'
import { LeagueSorter } from './league.sorter.js'
import { LeagueInput } from './league.input.js'
import { LeagueService } from './league.service.js'
import { Club } from '../club/club.entity.js'
/** @kit resolver.imports */

@Resolver( () => League )
@UseGuards( AuthGuard )
export class LeagueResolver {

    constructor ( private readonly service: LeagueService ) { }

    @Query( () => League, { name: 'league' } )
    @UseGuards( new ScopeGuard( [ 'leagues:read' ] ) )
    async queryOne (
        @Context( 'token' ) token: Token,
        @Args( 'id', { type: () => ID } ) id: string,
    ): Promise<League> {
        return this.service.one( { id }, undefined, token )
    }

    @Query( () => [ League ], { name: 'leagues' } )
    @UseGuards( new ScopeGuard( [ 'leagues:read' ] ) )
    async queryStream (
        @Context( 'token' ) token: Token,
        @Args( { name: 'filter', type: () => LeagueFilter, nullable: true } ) filter?: LeagueFilter,
        @Args( { name: 'sortBy', type: () => LeagueSorter, nullable: true } ) sorter?: LeagueSorter,
        @Args( { name: 'limit', type: () => Int, nullable: true, defaultValue: 100 } ) limit?: number,
    ): Promise<Repeater<League>> {
        return new Repeater<League>( async ( push, stop ) => {
            let done = false
            let cursor = null
            let total = 0
            const start = async () => {
                if ( done ) return stop()
                const { cursor: nextCursor, results } = await this.service.find( { filter, sorter, cursor, limit: 100 }, token )
                cursor = nextCursor
                total += results.length
                done = !nextCursor || ( limit && total >= limit )
                results.forEach( push )
                if ( done ) return stop()
                else setTimeout( start, 1000 )
            }
            start()
            await stop.then( () => { done = true } )
        } )
    }

    @Query( () => LeagueEdge, { name: 'leagueEdge' } )
    @UseGuards( new ScopeGuard( [ 'leagues:read' ] ) )
    async queryMany (
        @Context( 'token' ) token: Token,
        @Args( { name: 'filter', type: () => LeagueFilter, nullable: true } ) filter?: LeagueFilter,
        @Args( { name: 'sort', type: () => LeagueSorter, nullable: true } ) sorter?: LeagueSorter,
        @Args( { name: 'cursor', type: () => String, nullable: true } ) cursor?: string,
        @Args( { name: 'limit', type: () => Int, nullable: true, defaultValue: 100 } ) limit?: number,
        @Args( { name: 'offset', type: () => Int, nullable: true } ) offset?: number,
    ): Promise<IEdge<League>> {
        return this.service.find( { filter, sorter, cursor, limit, offset }, token )
    }

    @Mutation( () => Event, { name: 'league', nullable: true } )
    @UseGuards( new ScopeGuard( [ 'leagues:write' ] ) )
    public async mutateOne (
        @Context( 'token' ) token: Token,
        @Args( { name: 'input', type: () => LeagueInput, nullable: false } ) input: LeagueInput,
    ): Promise<Event> {
        return this.service.mutate( input, token )
    }

    @Mutation( () => [ Event ], { name: 'leagues', nullable: true } )
    @UseGuards( new ScopeGuard( [ 'leagues:write' ] ) )
    public async mutateMany (
        @Context( 'token' ) token: Token,
        @Args( { name: 'inputs', type: () => [ LeagueInput ] } ) inputs: LeagueInput[],
    ): Promise<Event[]> {
        return Promise.all( inputs.map( input => this.service.mutate( input, token ) ) )
    }

    @Mutation( () => [ Event ], { name: 'leagueBatch', nullable: true } )
    @UseGuards( new ScopeGuard( [ 'leagues:write' ] ) )
    public async mutateBatch (
        @Context( 'token' ) token: Token,
        @Args( { name: 'ids', type: () => [ ID ] } ) ids: string[],
        @Args( { name: 'input', type: () => LeagueInput } ) input: LeagueInput,
    ): Promise<Event[]> {
        return Promise.all( ids.map( id => this.service.mutate( { ...input, id }, token ) ) )
    }

    @ResolveField( () => [ Club ], { name: 'clubs' } )
    @UseGuards( new ScopeGuard( [ 'club:read' ] ) )
    public async resolveClubs(
            @Context( 'token' ) _token: Token,
            @Parent() league: League,
        ): Promise <Club[]> {
        return this.service.clubs( league )
    }

    /** @kit resolver.fields */

}
