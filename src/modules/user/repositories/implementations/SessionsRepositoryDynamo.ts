import { ICreateSessionDTO } from "@modules/user/dtos/ICreateSessionDTO";
import { Session } from "@modules/user/entities/Session";
import { dynamoDB, TableName } from "@shared/infra/database/DynamoDB";

import { ISessionsRepository } from "../ISessionsRepository";

export class SessionsRepositoryDynamo implements ISessionsRepository {
  async create({
    id,
    user_id,
    refresh_token,
    expiration_date,
  }: ICreateSessionDTO): Promise<Session> {
    try {
      const session = new Session();

      Object.assign(session, {
        id,
        user_id,
        refresh_token,
        expiration_date,
      });

      await dynamoDB.put({
        TableName,
        Item: {
          PK: `session`,
          SK: `session.id:${id}`,
          "GSI1-PK": `user.id:${user_id}`,
          "GSI1-SK": `session.id:${id}.created_at:${session.created_at.toISOString()}`,
          ...session,
          created_at: session.created_at.toISOString(),
          updated_at: session.updated_at.toISOString(),
          expiration_date: session.expiration_date.toISOString(),
        },
      });

      return session;
    } catch (err) {
      throw err;
    }
  }

  async find(id: string): Promise<Session | undefined> {
    try {
      const { Item } = await dynamoDB.get({
        TableName,
        Key: {
          PK: `session`,
          SK: `session.id:${id}`,
        },
      });

      const session = Item != null ? (Item as Session) : undefined;

      return session;
    } catch (err) {
      throw err;
    }
  }

  async findByUser(user_id: string): Promise<Session[]> {
    try {
      const { Items } = await dynamoDB.query({
        TableName,
        IndexName: "GSI1",
        KeyConditionExpression: `#P1 = :P1 and begins_with(#P2,:P2) `,
        ExpressionAttributeNames: {
          "#P1": `GSI1-PK`,
          "#P2": `GSI1-SK`,
        },
        ExpressionAttributeValues: {
          ":P1": `user.id:${user_id}`,
          ":P2": `session`,
        },
      });

      if (Items == null) {
        return [];
      }

      return Items as Session[];
    } catch (err) {
      throw err;
    }
  }

  async updateToken(id: string, new_refresh_token: string): Promise<void> {
    try {
      await dynamoDB.update({
        TableName,
        Key: {
          PK: `session`,
          SK: `session.id:${id}`,
        },
        UpdateExpression: `set #P1 = :P1`,
        ExpressionAttributeNames: {
          "#P1": "refresh_token",
        },
        ExpressionAttributeValues: {
          ":P1": new_refresh_token,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await dynamoDB.delete({
        TableName,
        Key: {
          PK: `session`,
          SK: `session.id:${id}`,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteByUser(user_id: string): Promise<void> {
    try {
      const sessions = await this.findByUser(user_id);

      const params = {
        RequestItems: {},
      };

      const delete_operations = sessions.map((session) => ({
        DeleteRequest: {
          Key: {
            PK: `session`,
            SK: `session.id:${session.id}`,
          },
        },
      }));

      if (delete_operations.length > 0) {
        params.RequestItems[TableName] = [...delete_operations];

        await dynamoDB.batchWrite({
          ...params,
        });
      }
    } catch (err) {
      throw err;
    }
  }

  async deleteExpiredByUser(user_id: string): Promise<void> {
    try {
      const sessions = await this.findByUser(user_id);

      const expired = sessions.filter(
        (session) =>
          new Date(session.expiration_date).toISOString() <
          new Date().toISOString()
      );

      const params = {
        RequestItems: {},
      };

      const delete_operations = expired.map((session) => ({
        DeleteRequest: {
          Key: {
            PK: `session`,
            SK: `session.id:${session.id}`,
          },
        },
      }));

      if (delete_operations.length > 0) {
        params.RequestItems[TableName] = [...delete_operations];

        await dynamoDB.batchWrite({
          ...params,
        });
      }
    } catch (err) {
      throw err;
    }
  }
}
