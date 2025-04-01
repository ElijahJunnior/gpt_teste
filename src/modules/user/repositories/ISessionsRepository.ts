import { ICreateSessionDTO } from "../dtos/ICreateSessionDTO";
import { Session } from "../entities/Session";

export interface ISessionsRepository {
  create(data: ICreateSessionDTO): Promise<Session>;
  find(id: string): Promise<Session | undefined>;
  findByUser(user_id: string): Promise<Session[]>;
  updateToken(id: string, new_refresh_token: string): Promise<void>;
  delete(id: string): Promise<void>;
  deleteByUser(user_id: string): Promise<void>;
  deleteExpiredByUser(user_id: string): Promise<void>;
}
