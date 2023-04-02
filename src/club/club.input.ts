import { IInput, MainInput } from "@aarock/api-kit"
import { InputType, Field, ID, Int } from '@nestjs/graphql'
import { Token } from '@aarock/token'
import { Relation } from "typeorm"
import { Club } from './club.entity.js'
import { LeagueInput } from '../league/league.input.js'
/** @kit input.imports */

@InputType()
export class ClubInput extends MainInput implements IInput<Club> {

    @Field( () => LeagueInput, { nullable: true } )
    public league?: Relation<LeagueInput>

    /** @kit input.fields */
    
    public static async normalize ( input: ClubInput, token?: Token, initialize?: boolean ): Promise<Club> {

        const league = input.league && await LeagueInput.normalize( input.league, token, !input.league.id )
        
        /** @kit input.normals */
        
        return {
            ...await super.normalize( input, token, initialize ),
            /** @kit input.returns */
            ...input.league !== undefined && { league: { id: league.id } },
            /** @kit input.stumps */
        }
    }

}