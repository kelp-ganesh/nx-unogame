import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup-dto';
import { LoginDto } from './dto/login-dto';
import { InjectModel } from '@nestjs/sequelize';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '@unogame/shared-lib';
import { PlayerModel } from '../model/player.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(PlayerModel)
    private playerModel: typeof PlayerModel,
    private jwtService: JwtService,
  ) {}

  async create(signupDto: SignupDto) {
    const user = await this.playerModel.findOne({
      where: { email: signupDto.email },
    });
    if (user) {
      throw new Error('User Already exists');
    }
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    await this.playerModel.create({
      name: signupDto.name,
      email: signupDto.email,
      password: hashedPassword,
      avatarId: signupDto.avatarId,
    });
  }

  async login(loginDto: LoginDto) {
    const rec = await this.playerModel.findOne({
      where: { email: loginDto.email },
    });
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
      access_token: token,
    };
  }
}
