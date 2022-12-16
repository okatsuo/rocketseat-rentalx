import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

type IRequest = {
  email: string;
  password: string;
};

type IResponse = {
  user: {
    name: string;
    email: string;
  };

  token: string;
  refreshToken: string;
};

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private userRepository: IUsersRepository,
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async exec({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new AppError("Email or password incorrect");

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) throw new AppError("Email or password incorrect");

    const token = jwt.sign({}, auth.secretToken, {
      subject: user.id,
      expiresIn: auth.expiresInToken,
    });

    const refreshToken = jwt.sign({ email }, auth.secretRefreshToken, {
      subject: user.id,
      expiresIn: auth.expiresInRefreshToken,
    });

    const refreshTokenExpiresDate = this.dateProvider.addDays(
      auth.expiresInRefreshTokenDays
    );

    await this.usersTokensRepository.create({
      user_id: user.id,
      refresh_token: refreshToken,
      expires_date: refreshTokenExpiresDate,
    });

    return {
      user: { email: user.email, name: user.name },
      token,
      refreshToken,
    };
  }
}
