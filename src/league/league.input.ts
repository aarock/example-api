import { IInput, MainInput } from "@aarock/api-kit"
import { InputType, Field, ID, Int } from '@nestjs/graphql'
import { Token } from '@aarock/token'
import { Relation } from "typeorm"
import { League } from './league.entity.js'
import { ClubInput } from '../club/club.input.js'
/** @kit input.imports */

@InputType()
export class LeagueInput extends MainInput implements IInput<League> {

    @Field( () => String, { nullable: true } )
    public myString?: string

    @Field( () => Number, { nullable: true } )
    public myNumber?: number

    @Field( () => Int, { nullable: true } )
    public myInt?: number

    @Field( () => ID, { nullable: true } )
    public myId?: string

    @Field( () => [ ClubInput ], { nullable: true } )
    public clubs?: Relation<ClubInput>[]

    /** @kit input.fields */
    
    public static async normalize ( input: LeagueInput, token?: Token, initialize?: boolean ): Promise<League> {

        const clubs = input.clubs && await Promise.all( input.clubs.map( entity => {
            return ClubInput.normalize( entity, token, !entity.id )
        } ) )
        
        /** @kit input.normals */
        
        return {
            ...await super.normalize( input, token, initialize ),
            ...!!input.myString && { myString: input.myString.toString() || "" },
            ...input.myNumber !== undefined && { myNumber: input.myNumber },
            ...input.myInt !== undefined && { myInt: input.myInt },
            ...input.myId !== undefined &&  { myId: input.myId },
            ...input.clubs !== undefined && { clubs },
            /** @kit input.returns */
            /** @kit input.stumps */
        }
    }

}