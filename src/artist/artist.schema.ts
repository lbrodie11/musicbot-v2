import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ArtistDocument = Artist & mongoose.Document;

@Schema()
@ObjectType()
export class Artist {
  @Field(() => ID)
  _id: string;

  @Prop({ required: false })
  @Field({ nullable: true })
  artistName: string;

  @Prop({ required: true })
  @Field()
  artistId: string;

  @Prop({ required: true })
  @Field()
  albumName: string

  @Prop({ required: true })
  @Field()
  albumId: string
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);

@InputType()
export class CreateArtistInput {

  @Field()
  artistName: string;

  @Field()
  artistId: string;

  @Field()
  albumName: string

  @Field()
  albumId: string

}

@InputType()
export class UpdateArtistAlbumInput {

  @Field()
  albumName: string

  @Field()
  albumId: string

}

