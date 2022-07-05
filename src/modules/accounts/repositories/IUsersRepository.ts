import { ICreateUserDTO } from "../dtos/ICreateUserDTO";

export type IUsersRepository = {
  create(data: ICreateUserDTO): Promise<void>;
};
