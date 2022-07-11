import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

type IPayload = {
  sub: string;
};

export const ensureAuthenticated = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { authorization } = request.headers;
  if (!authorization) throw new Error("Missing token");
  const { 1: token } = authorization.split(" ");
  console.log(`token: ${token}`);
  try {
    const { sub: userId } = verify(
      token,
      "294f5e38662ee52b2e30d4272d9876d7"
    ) as IPayload;

    const usersRepository = new UsersRepository();
    const user = await usersRepository.findById(userId);

    if (!user) throw new Error("User does not exists");

    return next();
  } catch (error) {
    throw new Error("Invalid token");
  }
};
