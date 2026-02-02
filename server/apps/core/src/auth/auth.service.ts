import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup-dto';
import { LoginDto } from './dto/login-dto';
import { InjectModel } from '@nestjs/sequelize';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '@unogame/shared-lib';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async create(signupDto: SignupDto): Promise<void> {
    const user = await this.userService.findUserByEmail(signupDto.email);
    if (user) {
      throw new Error('User Already exists');
    }
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    await this.userService.createUser(
      signupDto.name,
      signupDto.email,
      hashedPassword,
      signupDto.avatarId,
    );
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const rec = await this.userService.findUserByEmail(loginDto.email);
    const player = rec?.dataValues;
    if (!player) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      player.password as string,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const payload: IJwtPayload = { userId: player.id, email: player.email };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
    };
  }
}
