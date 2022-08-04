import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { AppError } from "../errors/AppError";
import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

type IPayload = {
  sub: string;
};

const jwtSecret = "294f5e38662ee52b2e30d4272d9876d7";

export const ensureAuthenticated = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { authorization } = request.headers;
  if (!authorization) throw new AppError("Missing token", 401);
  const { 1: token } = authorization.split(" ");
  try {
    const { sub: user_id } = verify(token, jwtSecret) as IPayload;
    const usersRepository = new UsersRepository();
    const user = await usersRepository.findById(user_id);

    if (!user) throw new AppError("User does not exists", 401);

    request.user = {
      id: user_id,
    };

    return next();
  } catch (error) {
    throw new AppError("Invalid token", 401);
  }
};
