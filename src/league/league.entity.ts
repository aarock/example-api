import { Auditable, MainEntity } from '@aarock/api-kit'
import { ObjectType, Field, ID, Int } from '@nestjs/graphql'
import { Entity, Relation, Column, JoinColumn, OneToOne, OneToMany, ManyToOne } from 'typeorm'
import { Club } from '../club/club.entity.js'
/** @kit entity.imports */

@Entity()
@ObjectType()
@Auditable()
export class League extends MainEntity {

    @Field( () => String, { nullable: true } )
    @Column( { type: 'text', nullable: true } )
    public myString: string
    
    @Field( () => Number, { nullable: true } )
    @Column( { type: 'double precision', nullable: true } )
    public myNumber: number;
    
    @Field( () => Int, { nullable: true } )
    @Column( { type: 'int', nullable: true } )
    public myInt: number;
    
    @Field( () => ID, { nullable: true } )
    @Column( { type: 'bigint', nullable: true } )
    public myId: string
    
    @Field( () => [ Club ], { nullable: true } )
    @OneToMany( () => Club, club => club.league, {}  )
    @JoinColumn()
    clubs?: Relation<Club>[]
    
    /** @kit entity.fields */
    
}