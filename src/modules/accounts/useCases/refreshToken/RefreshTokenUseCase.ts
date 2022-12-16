import jwt, { verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

type IPayload = {
  sub: string;
  email: string;
};

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute(token: string): Promise<string> {
    const { email, sub } = verify(token, auth.secretRefreshToken) as IPayload;
    const user_id = sub;
    const user_token =
      await this.usersTokensRepository.findByUserIdAndRefreshToken(
        user_id,
        token
      );

    if (!user_token) throw new AppError("Refresh Token does not exists!");

    await this.usersTokensRepository.deleteById(user_token.id);

    const refresh_token = jwt.sign({ email }, auth.secretRefreshToken, {
      subject: sub,
      expiresIn: auth.expiresInRefreshToken,
    });

    const refreshTokenExpiresDate = this.dateProvider.addDays(
      auth.expiresInRefreshTokenDays
    );

    await this.usersTokensRepository.create({
      user_id: sub,
      refresh_token,
      expires_date: refreshTokenExpiresDate,
    });

    return refresh_token;
  }
}
