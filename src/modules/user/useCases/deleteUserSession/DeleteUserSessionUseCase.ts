import { inject, injectable } from "tsyringe";

import { ISessionsRepository } from "@modules/user/repositories/ISessionsRepository";

import { DeleteUserSessionErro } from "./DeleteUserSessionErro";

@injectable()
export class DeleteUserSessionUseCase {
  constructor(
    @inject("SessionsRepository")
    private readonly sessionsRepository: ISessionsRepository
  ) {}

  async execute(session_id: string): Promise<void> {
    const session = await this.sessionsRepository.find(session_id);

    if (session === undefined) {
      throw new DeleteUserSessionErro.SessionNotFound();
    }

    await this.sessionsRepository.delete(session_id);
  }
}
