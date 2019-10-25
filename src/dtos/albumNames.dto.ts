import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class AlbumNames {
  @Field(() => [String])
  readonly albums: string[];
}
