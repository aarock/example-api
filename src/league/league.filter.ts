import { IFilter, MainFilter } from '@aarock/api-kit'
import { InputType, Field, ID, Int } from '@nestjs/graphql'
import { generate } from '@aarock/flake'
import { SelectQueryBuilder } from 'typeorm'
import { League } from './league.entity.js'
/** @kit filter.imports */

@InputType()
export class LeagueFilter extends MainFilter implements IFilter<League> {

    @Field( () => String, { nullable: true } )
    search?: string

    @Field( () => [ LeagueFilter ], { nullable: true } )
    and?: LeagueFilter[]

    @Field( () => [ LeagueFilter ], { nullable: true } )
    or?: LeagueFilter[]

    @Field( () => String, { nullable: true } )
    myString?: string

    @Field( () => String, { nullable: true } )
    myStringBefore?: string

    @Field( () => String, { nullable: true } )
    myStringAfter?: string

    @Field( () => [ String ], { nullable: true } )
    myStringIn?: string[]

    @Field( () => [ String ], { nullable: true } )
    myStringLikeAny?: string[]

    @Field( () => [ String ], { nullable: true } )
    myStringLikeAll?: string[]

    @Field( () => Number, { nullable: true } )
    myNumber?: number

    @Field( () => [ Number ], { nullable: true } )
    myNumberIn?: number

    @Field( () => Number, { nullable: true } )
    myNumberBefore?: number

    @Field( () => Number, { nullable: true } )
    myNumberAfter?: number

    @Field( () => Int, { nullable: true } )
    myInt?: number

    @Field( () => [ Int ], { nullable: true } )
    myIntIn?: number

    @Field( () => Int, { nullable: true } )
    myIntBefore?: number

    @Field( () => Int, { nullable: true } )
    myIntAfter?: number

    @Field( () => ID, { nullable: true } )
    myId?: string

    @Field( () => [ ID ], { nullable: true } )
    myIdIn?: string

    @Field( () => ID, { nullable: true } )
    myIdBefore?: string

    @Field( () => ID, { nullable: true } )
    myIdAfter?: string

    /** @kit filter.fields */

    public static filter ( qb: SelectQueryBuilder<any>, filter: LeagueFilter, alias: string ) {
        
        const fid = generate()
        
        if ( filter.search ) {
            qb.andWhere( `(${ alias }.name ILIKE :term${ fid })`, {
                [ `term${ fid }` ]: `%${ filter.search }%`,
            } )
        }

        if ( filter.myString ) {
            qb.andWhere( `LOWER(${ alias }.myString) ${ filter.not ? '!=' : '=' } (:myString${ fid })`, {
                [ `myString${ fid }` ]: filter.myString.toLowerCase()
            } )
        }

        if ( filter.myStringIn ) {
            qb.andWhere( `LOWER(${ alias }.myString) ${ filter.not ? 'NOT IN' : 'IN' } (:...myStringIn${ fid })`, {
                [ `myStringIn${ fid }` ]: filter.myStringIn.map( myString => myString.toLowerCase() ),
            } )
        }

        if ( filter.myStringLikeAny ) {
            qb.andWhere( `( ${ filter.myStringLikeAny.map( ( _myStringLike, i ) =>
                `LOWER(${ alias }.myString) ${ filter.not ? 'NOT ILIKE' : 'ILIKE' } :myStringLikeAny${ fid }_${ i }`
            ).join( ' OR ' ) } )`, filter.myStringLikeAny.reduce( ( map, myStringLike, i ) => ( {
                ...map,
                [ `myStringLikeAny${ fid }_${ i }` ]: `%${ myStringLike.toLowerCase() }%`,
            } ), {} ) )
        }

        if ( filter.myStringLikeAll ) {
            qb.andWhere( `( ${ filter.myStringLikeAll.map( ( _myStringLike, i ) =>
                `LOWER(${ alias }.myString) ${ filter.not ? 'NOT ILIKE' : 'ILIKE' } :myStringLikeAll${ fid }_${ i }`
            ).join( ' AND ' ) } )`, filter.myStringLikeAll.reduce( ( map, myStringLike, i ) => ( {
                ...map,
                [ `myStringLikeAll${ fid }_${ i }` ]: `%${ myStringLike.toLowerCase() }%`,
            } ), {} ) )
        }

        if ( filter.myStringBefore ) {
            qb.andWhere( `LOWER(${ alias }.myString) ${ filter.not ? '>=' : '<' } (:myStringBefore${ fid })`, {
                [ `myStringBefore${ fid }` ]: filter.myStringBefore.toLowerCase()
            } )
        }

        if ( filter.myStringAfter ) {
            qb.andWhere( `LOWER(${ alias }.myString) ${ filter.not ? '<=' : '>' } (:myStringAfter${ fid })`, {
                [ `myStringAfter${ fid }` ]: filter.myStringAfter.toLowerCase()
            } )
        }

        if ( filter.myNumber ) {
            qb.andWhere( `${ alias }.myNumber ${ filter.not ? '!=' : '=' } :myNumber${ fid }`, {
                [ `myNumber${ fid }` ]: filter.myNumber
            } )
        }

        if ( filter.myNumberIn ) {
            qb.andWhere( `${ alias }.myNumber ${ filter.not ? 'NOT IN' : 'IN' } (:...myNumberIn${ fid })`, {
                [ `myNumberIn${ fid }` ]: filter.myNumberIn,
            } )
        }

        if ( filter.myNumberBefore ) {
            qb.andWhere( `${ alias }.myNumber ${ filter.not ? '>=' : '<' } :myNumberBefore${ fid }`, {
                [ `myNumberBefore${ fid }` ]: filter.myNumberBefore
            } )
        }

        if ( filter.myNumberAfter ) {
            qb.andWhere( `${ alias }.myNumber ${ filter.not ? '<=' : '>' } :myNumberAfter${ fid }`, {
                [ `myNumberAfter${ fid }` ]: filter.myNumberAfter
            } )
        }

        if ( filter.myInt ) {
            qb.andWhere( `${ alias }.myInt ${ filter.not ? '!=' : '=' } :myInt${ fid }`, {
                [ `myInt${ fid }` ]: filter.myInt
            } )
        }

        if ( filter.myIntIn ) {
            qb.andWhere( `${ alias }.myInt ${ filter.not ? 'NOT IN' : 'IN' } (:...myIntIn${ fid })`, {
                [ `myIntIn${ fid }` ]: filter.myIntIn,
            } )
        }

        if ( filter.myIntBefore ) {
            qb.andWhere( `${ alias }.myInt ${ filter.not ? '>=' : '<' } :myIntBefore${ fid }`, {
                [ `myIntBefore${ fid }` ]: filter.myIntBefore
            } )
        }

        if ( filter.myIntAfter ) {
            qb.andWhere( `${ alias }.myInt ${ filter.not ? '<=' : '>' } :myIntAfter${ fid }`, {
                [ `myIntAfter${ fid }` ]: filter.myIntAfter
            } )
        }

        if ( filter.myId ) {
            qb.andWhere( `${ alias }.myId ${ filter.not ? '!=' : '=' } :myId${ fid }`, {
                [ `myId${ fid }` ]: filter.myId
            } )
        }

        if ( filter.myIdIn ) {
            qb.andWhere( `${ alias }.myId ${ filter.not ? 'NOT IN' : 'IN' } (:...myIdIn${ fid })`, {
                [ `myIdIn${ fid }` ]: filter.myIdIn,
            } )
        }

        if ( filter.myIdBefore ) {
            qb.andWhere( `${ alias }.myId ${ filter.not ? '>=' : '<' } :myIdBefore${ fid }`, {
                [ `myIdBefore${ fid }` ]: filter.myIdBefore
            } )
        }

        if ( filter.myIdAfter ) {
            qb.andWhere( `${ alias }.myId ${ filter.not ? '<=' : '>' } :myIdAfter${ fid }`, {
                [ `myIdAfter${ fid }` ]: filter.myIdAfter
            } )
        }

        /** @kit filter.filters */

        super.filter?.( qb, filter, alias )
    }

}