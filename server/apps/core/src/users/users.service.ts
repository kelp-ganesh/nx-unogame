import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../model/user.model';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
  ) {}

  async createUser(
    name: string,
    email: string,
    password: string,
    avatarId: string,
  ): Promise<UserModel> {
    this.logger.log(`Creating the User with username ${name}`);
    try {
      const user = await this.userModel.create({
        name,
        email,
        password,
        avatarId
      });
      this.logger.log(` User created with username ${name}`);
      return user;
    } catch (error) {
      this.logger.error(
        `Error while Creating the User   with username ${name}`,
      );
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<UserModel | null> {
    this.logger.log(`Finding the User with Email ${email}`);
    try {
      const user = await this.userModel.findOne({ where: { email } });
      this.logger.log(`User found with Email ${email}`);
      return user;
    } catch (error) {
      this.logger.error(`Error while finding the user - email ${email}}`);
      throw error;
    }
  }
}
