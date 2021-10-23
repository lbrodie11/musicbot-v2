import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AlbumType } from '../album/album.schema';

export type ArtistDocument = ArtistType & mongoose.Document;

@Schema()
@ObjectType()
export class ArtistType {
  @Field(() => ID)
  _id: string;

  @Prop()
  @Field({ nullable: true})
  name?: string;

  @Prop({ required: true })
  @Field()
  artistID: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AlbumType' }] })
  @Field(() => [AlbumType])
  albums: AlbumType[];
}

export const ArtistSchema = SchemaFactory.createForClass(ArtistType);

@InputType()
export class CreateArtistInput {

  @Field()
  name: string;

  @Field()
  artistID: string;
}

