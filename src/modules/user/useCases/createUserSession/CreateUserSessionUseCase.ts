import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { v4 as uuid } from "uuid";

import { IUserSessionDTO } from "@modules/user/dtos/IUserSessionDTO";
import { SessionMap } from "@modules/user/mappers/SessionMap";
import { ISessionsRepository } from "@modules/user/repositories/ISessionsRepository";
import { IUsersRepository } from "@modules/user/repositories/IUsersRepository";
import { IPayloadJwt } from "@shared/types/IPayloadJwt";
import {
  convertDateToTimestamp,
  handleJWTExpirationDate,
} from "@shared/utils/DateHandle";

import { CreateUserSessionError } from "./CreateUserSessionError";

interface ICreateSessionProps {
  email: string;
  password: string;
}

@injectable()
export class CreateUserSessionUseCase {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
    @inject("SessionsRepository")
    private readonly sessionsRepository: ISessionsRepository
  ) {}

  async execute({
    email,
    password,
  }: ICreateSessionProps): Promise<IUserSessionDTO> {
    // Validando dados do usuário
    const user = await this.usersRepository.findByEmail(email);

    if (user === undefined) {
      throw new CreateUserSessionError.InvalidAuthenticationData();
    }

    const is_valid_password = await compare(password, user.password);

    if (!is_valid_password) {
      throw new CreateUserSessionError.InvalidAuthenticationData();
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
    const token = sign(payload, token_secret);

    const refresh_secret = process.env.JWT_REFRESH_TOKEN_SECRET as string;
    const refresh_interval = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string;
    const refresh_expiration = handleJWTExpirationDate(refresh_interval);
    const session_id = uuid();

    payload.exp = convertDateToTimestamp(refresh_expiration);
    payload.iat = convertDateToTimestamp(new Date());
    payload.session_id = session_id;

    const refresh_token = sign(payload, refresh_secret);

    // Gravando dados e retornando resultado
    await this.sessionsRepository.deleteExpiredByUser(user.id);

    await this.sessionsRepository.create({
      id: session_id,
      user_id: user.id,
      refresh_token,
      expiration_date: refresh_expiration,
    });

    const session = SessionMap.toUserSessionDTO({
      refresh_token,
      token,
      user,
    });

    return session;
  }
}
