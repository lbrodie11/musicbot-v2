import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { authenticate } from 'passport';
import { AuthController } from './auth.controller';
import { UserModule } from './user.module';
import { JwtModule } from '@nestjs/jwt';
import '../../config/env';

// Strategies
import { FaceBookStrategy } from './facebook.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWTSECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [FaceBookStrategy],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(authenticate('facebook', { session: false }))
      .forRoutes('auth/facebook/token');
  }
}
