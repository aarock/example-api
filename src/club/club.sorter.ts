import { SortDirection, ISorter, MainSorter } from '@aarock/api-kit'
import { InputType, Field } from '@nestjs/graphql'
import { Club } from './club.entity.js'
/** @kit sorter.imports */

@InputType()
export class ClubSorter extends MainSorter implements ISorter<Club> {

    @Field( () => ClubSorter, { nullable: true } )
    then?: ClubSorter

    /** @kit sorter.fields */

}
