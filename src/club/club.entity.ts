import { Auditable, MainEntity } from '@aarock/api-kit'
import { ObjectType, Field, ID, Int } from '@nestjs/graphql'
import { Entity, Relation, Column, JoinColumn, OneToOne, OneToMany, ManyToOne } from 'typeorm'
import { League } from '../league/league.entity.js'
/** @kit entity.imports */

@Entity()
@ObjectType()
@Auditable()
export class Club extends MainEntity {

    @Field( () => League, { nullable: false } )
    @ManyToOne( () => League, league => league.clubs, { nullable: false } )
    @JoinColumn()
    league: Relation<League>
    
    /** @kit entity.fields */

}