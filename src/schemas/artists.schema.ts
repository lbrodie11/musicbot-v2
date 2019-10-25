import * as mongoose from 'mongoose';

export const ArtistSchema = new mongoose.Schema({
  artistName: { type: String, required: true },
  albums: { type: Array, required: true },
});
