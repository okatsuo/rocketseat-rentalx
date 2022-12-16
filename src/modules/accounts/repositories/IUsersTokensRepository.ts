import { ICreateUserTokenDTO } from "../dtos/ICreateUsersTokenDTO";
import { UserTokens } from "../infra/typeorm/entities/UserTokens";

export type IUsersTokensRepository = {
  create(data: ICreateUserTokenDTO): Promise<UserTokens>;

  findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens>;

  deleteById(id: string): Promise<void>;
};
