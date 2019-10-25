import * as mongoose from 'mongoose';

export interface Artist extends mongoose.Document {
  id: string;
  artistName: string;
  albums: [string];
}
