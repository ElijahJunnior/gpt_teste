import { ISessionDTO } from "../dtos/ISessionDTO";
import { IUserSessionDTO } from "../dtos/IUserSessionDTO";
import { Session } from "../entities/Session";
import { User } from "../entities/User";

export class SessionMap {
  static toUserSessionDTO({
    user,
    token,
    refresh_token,
  }: {
    user: User;
    token: string;
    refresh_token: string;
  }): IUserSessionDTO {
    const session = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        validated: user.validated,
        created_at: user.created_at,
      },
      token,
      refresh_token,
    };

    return session;
  }

  static toSessionDTO({
    created_at,
    expiration_date,
    id,
    updated_at,
    user_id,
  }: Session): ISessionDTO {
    const session = {
      id,
      user_id,
      expiration_date,
      created_at,
      updated_at,
    };

    return session;
  }
}
