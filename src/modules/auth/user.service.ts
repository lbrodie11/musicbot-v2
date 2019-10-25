import { Injectable } from '@nestjs/common';
import { User } from './user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async findOrCreate(profile): Promise<User> {
    const user = await this.userModel
      .findOne({ 'facebook.id': profile.id })
      .exec();
    if (user) {
      return user;
    }
    const createdUser = new this.userModel({
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      Facebook: {
        id: profile.id,
        avatar: profile.photos[0].value,
      },
    });
    return createdUser.save();
  }
  async getUsers() {
    const users = await this.userModel.find().exec();
    return users.map(user => ({
      email: user.email,
    }));
  }
}
