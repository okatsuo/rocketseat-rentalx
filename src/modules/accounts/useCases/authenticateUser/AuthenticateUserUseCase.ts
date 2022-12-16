import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
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
};

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private userRepository: IUsersRepository
  ) {}

  async exec({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new AppError("Email or password incorrect");

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) throw new AppError("Email or password incorrect");

    const token = jwt.sign({}, "294f5e38662ee52b2e30d4272d9876d7", {
      subject: user.id,
      expiresIn: "1d",
    });

    return {
      user: { email: user.email, name: user.name },
      token,
    };
  }
}
