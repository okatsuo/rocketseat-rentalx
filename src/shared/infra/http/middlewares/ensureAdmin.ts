import { NextFunction, Request, Response } from "express";

import { UsersRepository } from "@modules/accounts/repositories/implementations/UsersRepository";
import { AppError } from "@shared/errors/AppError";

export const ensureAdmin = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id } = request.user;
  const usersRepository = new UsersRepository();
  const user = await usersRepository.findById(id);
  if (!user.isAdmin) throw new AppError("User is not an admin!");
  return next();
};
