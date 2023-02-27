import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import auth from "@config/auth";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";
import { AppError } from "@shared/errors/AppError";

type IPayload = {
  sub: string;
};

export const ensureAuthenticated = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { authorization } = request.headers;

  if (!authorization) throw new AppError("Missing token", 401);
  const { 1: token } = authorization.split(" ");

  try {
    const { sub: user_id } = verify(token, auth.secretRefreshToken) as IPayload;

    const usersTokensRepository = new UsersTokensRepository();
    const user = await usersTokensRepository.findByUserIdAndRefreshToken(
      user_id,
      token
    );

    if (!user) throw new AppError("User does not exists", 401);

    request.user = {
      id: user_id,
    };

    return next();
  } catch (error) {
    console.log({ error });
    throw new AppError("Invalid token", 401);
  }
};
