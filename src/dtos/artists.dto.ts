import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class Artist {
  @Field(() => ID)
  id: string;
  @Field()
  readonly artistName: string;
  @Field(() => [String])
  readonly albums: string[];
}
