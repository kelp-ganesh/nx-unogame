export interface ISignUpRequest {
  name: string;
  email: string;
  password: string;
  avatarId: string;
}

export interface ISignInRequest {
  email: string;
  password: string;
}

export interface ISignUpResponse {
  status: boolean;
  desc: string;
}

export interface ISigninResponse {
  status: boolean;
  access_token: string;
  msg: string;
}

export interface IJwtPayload {
  userId: string;
  email: string;
}
