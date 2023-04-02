import { AuthGuard, ScopeGuard, Event, Repeater, IEdge } from "@aarock/api-kit"
import { Resolver, Query, Args, Mutation, Context, ID, Int, ResolveField, Parent } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { Token } from '@aarock/token'
import { Club } from './club.entity.js'
import { ClubEdge } from './club.edge.js'
import { ClubFilter } from './club.filter.js'
import { ClubSorter } from './club.sorter.js'
import { ClubInput } from './club.input.js'
import { ClubService } from './club.service.js'
import { League } from '../league/league.entity.js'
/** @kit resolver.imports */

@Resolver( () => Club )
@UseGuards( AuthGuard )
export class ClubResolver {

    constructor ( private readonly service: ClubService ) { }

    @Query( () => Club, { name: 'club' } )
    @UseGuards( new ScopeGuard( [ 'clubs:read' ] ) )
    async queryOne (
        @Context( 'token' ) token: Token,
        @Args( 'id', { type: () => ID } ) id: string,
    ): Promise<Club> {
        return this.service.one( { id }, undefined, token )
    }

    @Query( () => [ Club ], { name: 'clubs' } )
    @UseGuards( new ScopeGuard( [ 'clubs:read' ] ) )
    async queryStream (
        @Context( 'token' ) token: Token,
        @Args( { name: 'filter', type: () => ClubFilter, nullable: true } ) filter?: ClubFilter,
        @Args( { name: 'sortBy', type: () => ClubSorter, nullable: true } ) sorter?: ClubSorter,
        @Args( { name: 'limit', type: () => Int, nullable: true, defaultValue: 100 } ) limit?: number,
    ): Promise<Repeater<Club>> {
        return new Repeater<Club>( async ( push, stop ) => {
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

    @Query( () => ClubEdge, { name: 'clubEdge' } )
    @UseGuards( new ScopeGuard( [ 'clubs:read' ] ) )
    async queryMany (
        @Context( 'token' ) token: Token,
        @Args( { name: 'filter', type: () => ClubFilter, nullable: true } ) filter?: ClubFilter,
        @Args( { name: 'sort', type: () => ClubSorter, nullable: true } ) sorter?: ClubSorter,
        @Args( { name: 'cursor', type: () => String, nullable: true } ) cursor?: string,
        @Args( { name: 'limit', type: () => Int, nullable: true, defaultValue: 100 } ) limit?: number,
        @Args( { name: 'offset', type: () => Int, nullable: true } ) offset?: number,
    ): Promise<IEdge<Club>> {
        return this.service.find( { filter, sorter, cursor, limit, offset }, token )
    }

    @Mutation( () => Event, { name: 'club', nullable: true } )
    @UseGuards( new ScopeGuard( [ 'clubs:write' ] ) )
    public async mutateOne (
        @Context( 'token' ) token: Token,
        @Args( { name: 'input', type: () => ClubInput, nullable: false } ) input: ClubInput,
    ): Promise<Event> {
        return this.service.mutate( input, token )
    }

    @Mutation( () => [ Event ], { name: 'clubs', nullable: true } )
    @UseGuards( new ScopeGuard( [ 'clubs:write' ] ) )
    public async mutateMany (
        @Context( 'token' ) token: Token,
        @Args( { name: 'inputs', type: () => [ ClubInput ] } ) inputs: ClubInput[],
    ): Promise<Event[]> {
        return Promise.all( inputs.map( input => this.service.mutate( input, token ) ) )
    }

    @Mutation( () => [ Event ], { name: 'clubBatch', nullable: true } )
    @UseGuards( new ScopeGuard( [ 'clubs:write' ] ) )
    public async mutateBatch (
        @Context( 'token' ) token: Token,
        @Args( { name: 'ids', type: () => [ ID ] } ) ids: string[],
        @Args( { name: 'input', type: () => ClubInput } ) input: ClubInput,
    ): Promise<Event[]> {
        return Promise.all( ids.map( id => this.service.mutate( { ...input, id }, token ) ) )
    }

    @ResolveField( () => League, { name: 'league' } )
    @UseGuards( new ScopeGuard( [ 'league:read' ] ) )
    public async resolveLeague(
            @Context( 'token' ) _token: Token,
            @Parent() club: Club,
        ): Promise <League> {
        return this.service.league( club )
    }

    /** @kit resolver.fields */

}
