import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import { ArtistType } from '../artist/artist.schema';

export type AlbumDocument = AlbumType & mongoose.Document;

@Schema()
@ObjectType()
export class AlbumType {
  @Field(() => ID)
  _id: number;

  @Prop({ required: true })
  @Field()
  albumName: string;

  @Prop({ required: true })
  @Field()
  albumID: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ArtistType' })
  @Field(() => ArtistType)
  artist: ArtistType | number;
}

export const AlbumSchema = SchemaFactory.createForClass(AlbumType);

@InputType()
export class CreateAlbumInput {

  @Field()
  albumName: string;

  @Field()
  artist: string;

  @Field()
  albumID: string;
}

@InputType()
export class FindAlbumInput {
  @Field()
  _id: string;
}