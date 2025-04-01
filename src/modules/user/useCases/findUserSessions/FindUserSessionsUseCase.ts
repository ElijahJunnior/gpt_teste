import { inject, injectable } from "tsyringe";

import { ISessionDTO } from "@modules/user/dtos/ISessionDTO";
import { SessionMap } from "@modules/user/mappers/SessionMap";
import { ISessionsRepository } from "@modules/user/repositories/ISessionsRepository";

@injectable()
export class FindUserSessionsUseCase {
  constructor(
    @inject("SessionsRepository")
    private readonly sessionsRepository: ISessionsRepository
  ) {}

  async execute(user_id: string): Promise<ISessionDTO[]> {
    await this.sessionsRepository.deleteExpiredByUser(user_id);

    const sessions_base = await this.sessionsRepository.findByUser(user_id);

    const sessions = sessions_base.map((session) =>
      SessionMap.toSessionDTO(session)
    );

    return sessions;
  }
}
