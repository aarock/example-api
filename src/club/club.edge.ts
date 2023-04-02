import { IEdge } from '@aarock/api-kit'
import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Club } from './club.entity.js'

@ObjectType()
export class ClubEdge implements IEdge<Club> {

    @Field( () => [ Club ] )
    results: Club[]

    @Field( { nullable: true } )
    cursor: string

    @Field( () => Int )
    total: number

}
