import { PrismaClient } from '@prisma/client';
import { LoginDto } from '../dto';
import { ForbiddenException, Injectable, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class Find {
  constructor(private prisma: PrismaService) {}

  async findEmail(email: string) {
    try {
      const validEmail: LoginDto = await this.prisma.user.findFirst({
        where: { email: email },
      });
      console.log(validEmail.email);
      if (validEmail) {
        return validEmail;
      }
    } catch (error) {
      console.log(error);
      return { msg: 'Server unreachable', status: false, statusCode: 403 };
    }
  }
}
