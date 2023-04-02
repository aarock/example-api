import { IEdge } from '@aarock/api-kit'
import { ObjectType, Field, Int } from '@nestjs/graphql'
import { League } from './league.entity.js'

@ObjectType()
export class LeagueEdge implements IEdge<League> {

    @Field( () => [ League ] )
    results: League[]

    @Field( { nullable: true } )
    cursor: string

    @Field( () => Int )
    total: number

}
