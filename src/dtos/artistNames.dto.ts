import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class ArtistNames {
  @Field()
  readonly artistName: string;
}
