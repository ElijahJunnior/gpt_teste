import { ICreateSessionDTO } from "@modules/user/dtos/ICreateSessionDTO";
import { Session } from "@modules/user/entities/Session";

import { ISessionsRepository } from "../ISessionsRepository";

export class SessionsRepositoryInMemory implements ISessionsRepository {
  private readonly sessions: Session[];

  private cloneSession(session: Session): Session {
    const new_session = {
      ...session,
    };

    return new_session;
  }

  constructor() {
    if (this.sessions == null) {
      this.sessions = [];
    }
  }

  async create({
    id,
    refresh_token,
    user_id,
    expiration_date,
  }: ICreateSessionDTO): Promise<Session> {
    const session = new Session();

    Object.assign(session, {
      id,
      user_id,
      refresh_token,
      expiration_date,
    });

    this.sessions.push(session);

    return this.cloneSession(session);
  }

  async find(id: string): Promise<Session | undefined> {
    const session = this.sessions.find((session) => session.id === id);

    if (session != null) {
      return this.cloneSession(session);
    } else {
      return undefined;
    }
  }

  async findByUser(user_id: string): Promise<Session[]> {
    const user_sessions = this.sessions.filter(
      (session) => session.user_id === user_id
    );

    if (user_sessions == null) {
      return [];
    } else {
      return user_sessions.map((session) => this.cloneSession(session));
    }
  }

  async updateToken(id: string, new_refresh_token: string): Promise<void> {
    const session = this.sessions.find((session) => session.id === id);

    if (session != null) {
      session.refresh_token = new_refresh_token;
      session.updated_at = new Date();
    }
  }

  async delete(id: string): Promise<void> {
    const session_index = this.sessions.findIndex(
      (session) => session.id === id
    );

    if (session_index >= 0) {
      this.sessions.splice(session_index, 1);
    }
  }

  async deleteByUser(user_id: string): Promise<void> {
    const sessions = this.sessions.filter(
      (session) => session.user_id === user_id
    );

    for (const session of sessions) {
      await this.delete(session.id);
    }
  }

  async deleteExpiredByUser(user_id: string): Promise<void> {
    const sessions = this.sessions.filter(
      (session) =>
        session.user_id === user_id &&
        session.expiration_date.toISOString() < new Date().toISOString()
    );

    for (const session of sessions) {
      await this.delete(session.id);
    }
  }
}
