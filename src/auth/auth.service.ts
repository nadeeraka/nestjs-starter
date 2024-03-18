import { PrismaService } from 'src/prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { AuthDto, LoginDto } from 'src/util/dto';
import * as argon from 'argon2';
import { Find } from 'src/util/query';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private findUser: Find,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.sign(payload, {
      expiresIn: '15m',
      secret: this.config.get('SECRET'),
    });

    return {
      access_token: token,
    };
  }

  async login(dto: LoginDto) {
    let userDetails: string | any = '';
    // find the user by email
    try {
      const user: any = await this.findUser.findEmail(dto.email);
      if (!user) {
        throw new ForbiddenException('Credentials incorrect');
      }
      userDetails = user;
      // check password
      const pwMatches = await argon.verify(user.password, dto.password);
      if (!pwMatches) {
        throw new ForbiddenException('Credentials incorrect');
      }
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException();
    }
    // jwt token setup
    const token = await this.signToken(userDetails.id, userDetails.email);
    return { msg: 'login success', token };
  }

  async signup(dto: AuthDto) {
    // generate password hash
    const hash = await argon.hash(dto.password);

    const result = await this.findUser.findEmail(dto.email);
    if (result) {
      throw new ForbiddenException('Credentials taken');
    }
    // create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        // firstName: dto.firstName,
        // lastName: dto.lastName,
      },
      select: {
        email: true,
        name: true,
        id: true,
        createdAt: true,
      },
    });
    return {
      msg: 'User created successfully',
      user,
      status: true,
    };
  }
}
