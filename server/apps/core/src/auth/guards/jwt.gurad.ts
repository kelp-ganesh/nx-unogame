import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//not used until but for future authenticated routes
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
