import { SortDirection, ISorter, MainSorter } from '@aarock/api-kit'
import { InputType, Field } from '@nestjs/graphql'
import { League } from './league.entity.js'
/** @kit sorter.imports */

@InputType()
export class LeagueSorter extends MainSorter implements ISorter<League> {

    @Field( () => LeagueSorter, { nullable: true } )
    then?: LeagueSorter

    @Field( () => SortDirection, { nullable: true } )
    myString?: SortDirection

    @Field( () => SortDirection, { nullable: true } )
    myNumber?: SortDirection

    /** @kit sorter.fields */}
