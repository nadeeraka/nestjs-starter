import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './auth';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { Find } from 'src/util/query';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/util/auth/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, Auth, PrismaService, Find, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {
  constructor(private authService: AuthService) {}
}
