import { IFilter, MainFilter } from '@aarock/api-kit'
import { InputType, Field, ID, Int } from '@nestjs/graphql'
import { generate } from '@aarock/flake'
import { SelectQueryBuilder } from 'typeorm'
import { Club } from './club.entity.js'
/** @kit filter.imports */

@InputType()
export class ClubFilter extends MainFilter implements IFilter<Club> {

    @Field( () => String, { nullable: true } )
    search?: string

    @Field( () => [ ClubFilter ], { nullable: true } )
    and?: ClubFilter[]

    @Field( () => [ ClubFilter ], { nullable: true } )
    or?: ClubFilter[]

    /** @kit filter.fields */

    public static filter ( qb: SelectQueryBuilder<any>, filter: ClubFilter, alias: string ) {
        
        const fid = generate()
        
        if ( filter.search ) {
            qb.andWhere( `(${ alias }.name ILIKE :term${ fid })`, {
                [ `term${ fid }` ]: `%${ filter.search }%`,
            } )
        }

        /** @kit filter.filters */

        super.filter?.( qb, filter, alias )
    }

}