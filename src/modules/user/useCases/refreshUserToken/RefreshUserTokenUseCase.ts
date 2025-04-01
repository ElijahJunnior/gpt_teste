import { decode, sign, TokenExpiredError, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { IUserSessionDTO } from "@modules/user/dtos/IUserSessionDTO";
import { UserError } from "@modules/user/errors/UserError";
import { SessionMap } from "@modules/user/mappers/SessionMap";
import { ISessionsRepository } from "@modules/user/repositories/ISessionsRepository";
import { IUsersRepository } from "@modules/user/repositories/IUsersRepository";
import { IPayloadJwt } from "@shared/types/IPayloadJwt";
import {
  convertDateToTimestamp,
  handleJWTExpirationDate,
} from "@shared/utils/DateHandle";

import { RefreshUserTokenErro } from "./RefreshUserTokenErro";

@injectable()
export class RefreshUserTokenUseCase {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
    @inject("SessionsRepository")
    private readonly sessionsRepository: ISessionsRepository
  ) {}

  async execute(refresh_token: string): Promise<IUserSessionDTO> {
    const { sub: user_id, session_id } = decode(refresh_token) as IPayloadJwt;

    if (user_id == null || session_id == null) {
      throw new RefreshUserTokenErro.InvalidRefreshToken();
    }

    const user = await this.usersRepository.findById(user_id);

    if (user === undefined) {
      throw new UserError.UserNotFound();
    }

    const session = await this.sessionsRepository.find(session_id);

    if (session == null || session.refresh_token !== refresh_token) {
      throw new RefreshUserTokenErro.InvalidRefreshToken();
    }

    try {
      verify(refresh_token, process.env.JWT_REFRESH_TOKEN_SECRET as string);
    } catch (err) {
      await this.sessionsRepository.delete(session.id);

      if (err instanceof TokenExpiredError) {
        throw new RefreshUserTokenErro.ExpiredRefreshToken();
      }

      throw new RefreshUserTokenErro.InvalidRefreshToken();
    }

    // Gerando Token
    const token_secret = process.env.JWT_TOKEN_SECRET as string;
    const token_interval = process.env.JWT_TOKEN_EXPIRES_IN as string;
    const token_expiration = handleJWTExpirationDate(token_interval);

    const payload: IPayloadJwt = {
      sub: user.id,
      roles: ["user"],
      iat: convertDateToTimestamp(new Date()),
      exp: convertDateToTimestamp(token_expiration),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        validated: user.validated,
      },
    };

    // Gerando Refresh Token
    const new_token = sign(payload, token_secret);

    const refresh_secret = process.env.JWT_REFRESH_TOKEN_SECRET as string;
    const refresh_interval = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string;
    const refresh_expiration = handleJWTExpirationDate(refresh_interval);

    payload.exp = convertDateToTimestamp(refresh_expiration);
    payload.iat = convertDateToTimestamp(new Date());
    payload.session_id = session.id;

    const new_refresh_token = sign(payload, refresh_secret);

    // Gravando dados e retornando resultado
    await this.sessionsRepository.updateToken(session.id, new_refresh_token);

    const new_session = SessionMap.toUserSessionDTO({
      refresh_token: new_refresh_token,
      token: new_token,
      user,
    });

    return new_session;
  }
}
