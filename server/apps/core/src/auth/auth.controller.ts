import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup-dto';
import { LoginDto } from './dto/login-dto';
import type { Request, Response } from 'express';
import { ACCESS_TOKEN_MAX_AGE } from '../common/constants/auth.const';
import { ISignUpResponse, ISigninResponse } from '@unogame/shared-lib';
import { Logger } from '@nestjs/common';

@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<ISignUpResponse> {
    try {
      await this.authService.create(signupDto);
      return { status: true, desc: 'successfully created user' };
    } catch (error) {
      this.logger.error(error.message);
      return { status: false, desc: error.message };
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ISigninResponse> {
    try {
      const { access_token } = await this.authService.login(loginDto);
      response.cookie('authToken', access_token, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });
      return { status: true, access_token, msg: 'none' };
    } catch (error) {
      this.logger.error(error.message);
      return { status: false, access_token: 'null', msg: error.message };
    }
  }
}
