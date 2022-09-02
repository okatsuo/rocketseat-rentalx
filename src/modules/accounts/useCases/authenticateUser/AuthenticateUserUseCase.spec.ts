import { AppError } from "@errors/AppError";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should not be able to authenticate an nonexistent user", async () => {
    const response = authenticateUserUseCase.exec({
      email: "nonexistentuser@mail.com",
      password: "valid-password",
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with incorrect password", async () => {
    const user: ICreateUserDTO = {
      name: "valid-name",
      email: "valid-mail@mail.com",
      driver_license: "valid-driver-license",
      password: "valid-password",
    };
    await createUserUseCase.exec(user);

    const response = authenticateUserUseCase.exec({
      email: user.email,
      password: "incorrect-password",
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "valid-name",
      email: "valid-mail@mail.com",
      driver_license: "valid-driver-license",
      password: "valid-password",
    };
    await createUserUseCase.exec(user);

    const response = await authenticateUserUseCase.exec({
      email: user.email,
      password: user.password,
    });

    expect(response).toHaveProperty("token");
    expect(typeof response.token).toBe("string");
  });
});
