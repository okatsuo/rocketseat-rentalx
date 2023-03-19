import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepository: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

describe("Send forgot mail", () => {
  beforeEach(() => {
    dateProvider = new DayjsDateProvider();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepository = new UsersTokensRepositoryInMemory();
    mailProvider = new MailProviderInMemory();
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepository,
      dateProvider,
      mailProvider
    );
  });

  it("should be able to send a forgot password mail to user", async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail')

    await usersRepositoryInMemory.create({
      driver_license: "000123",
      email: "valid-name@email.com",
      name: "valid-name",
      password: "valid-password",
    })

    await sendForgotPasswordMailUseCase.execute("valid-name@email.com");

    expect(sendMail).toHaveBeenCalledTimes(1);
  });

  it('should not be able to send an email if user does not exists', async () => {
    await expect(sendForgotPasswordMailUseCase.execute("valid-name@email.com")).rejects.toEqual(
      new AppError("User does not exists!")
    )
  });

  it('should be able to create an users token', async () => {
    const usersTokensRepositorySpy = jest.spyOn(usersTokensRepository, 'create')

    await usersRepositoryInMemory.create({
      driver_license: "000124",
      email: "valid-username@email.com",
      name: "valid-username",
      password: "valid-password",
    })

    await sendForgotPasswordMailUseCase.execute("valid-username@email.com");

    expect(usersTokensRepositorySpy).toBeCalledTimes(1);
  });
});
