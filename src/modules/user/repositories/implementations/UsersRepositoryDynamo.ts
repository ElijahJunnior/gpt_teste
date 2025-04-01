import { IUserCreateDTO } from "@modules/user/dtos/IUserCreateDTO";
import { IUserUpdateDTO } from "@modules/user/dtos/IUserUpdateDTO";
import { User } from "@modules/user/entities/User";
import { dynamoDB, TableName } from "@shared/infra/database/DynamoDB";

import { IUsersRepository } from "../IUsersRepository";

export class UsersRepositoryDynamo implements IUsersRepository {
  async create({ email, name, password }: IUserCreateDTO): Promise<User> {
    try {
      const user = new User();

      Object.assign(user, { email, name, password });

      await dynamoDB.put({
        TableName,
        Item: {
          PK: "user",
          SK: `user.id:${user.id}`,
          "GSI1-PK": "user",
          "GSI1-SK": `user.email:${email}`,
          ...user,
          created_at: user.created_at.toISOString(),
        },
      });

      return user;
    } catch (err) {
      throw err;
    }
  }

  async findById(id: string): Promise<User | undefined> {
    try {
      const { Item } = await dynamoDB.get({
        TableName,
        Key: {
          PK: "user",
          SK: `user.id:${id}`,
        },
      });

      const user = (Item as User) ?? undefined;

      return user;
    } catch (err) {
      throw err;
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const { Items } = await dynamoDB.query({
        TableName,
        IndexName: "GSI1",
        KeyConditionExpression: "#P1 = :P1 and #P2 = :P2",
        ExpressionAttributeNames: {
          "#P1": `GSI1-PK`,
          "#P2": `GSI1-SK`,
        },
        ExpressionAttributeValues: {
          ":P1": `user`,
          ":P2": `user.email:${email}`,
        },
      });

      if (Items == null || Items.length < 1) {
        return undefined;
      }

      return Items[0] as User;
    } catch (err) {
      throw err;
    }
  }

  async update({ user_id, name }: IUserUpdateDTO): Promise<void> {
    try {
      await dynamoDB.update({
        TableName,
        Key: {
          PK: "user",
          SK: `user.id:${user_id}`,
        },
        UpdateExpression: `set #P1 = :P1`,
        ExpressionAttributeNames: {
          "#P1": "name",
        },
        ExpressionAttributeValues: {
          ":P1": name,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async updatePassword(user_id: string, new_password: string): Promise<void> {
    try {
      await dynamoDB.update({
        TableName,
        Key: {
          PK: "user",
          SK: `user.id:${user_id}`,
        },
        UpdateExpression: `set #P1 = :P1`,
        ExpressionAttributeNames: {
          "#P1": "password",
        },
        ExpressionAttributeValues: {
          ":P1": new_password,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async updateValidationKey(
    user_id: string,
    new_validation_key: string
  ): Promise<void> {
    try {
      await dynamoDB.update({
        TableName,
        Key: {
          PK: "user",
          SK: `user.id:${user_id}`,
        },
        UpdateExpression: `set #P1 = :P1`,
        ExpressionAttributeNames: {
          "#P1": "validation_key",
        },
        ExpressionAttributeValues: {
          ":P1": new_validation_key,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async updateForgotPasswordKey(
    user_id: string,
    new_reset_password_key: string
  ): Promise<void> {
    try {
      await dynamoDB.update({
        TableName,
        Key: {
          PK: "user",
          SK: `user.id:${user_id}`,
        },
        UpdateExpression: `set #P1 = :P1`,
        ExpressionAttributeNames: {
          "#P1": "reset_password_key",
        },
        ExpressionAttributeValues: {
          ":P1": new_reset_password_key,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async setValidatedAndClearValidationKey(user_id: string): Promise<void> {
    try {
      await dynamoDB.update({
        TableName,
        Key: {
          PK: "user",
          SK: `user.id:${user_id}`,
        },
        UpdateExpression: `set #P1 = :P1, #P2 = :P2`,
        ExpressionAttributeNames: {
          "#P1": "validation_key",
          "#P2": "validated",
        },
        ExpressionAttributeValues: {
          ":P1": "",
          ":P2": true,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async updatedPasswordAndClearForgotKey(
    user_id: string,
    new_password: string
  ): Promise<void> {
    try {
      await dynamoDB.update({
        TableName,
        Key: {
          PK: "user",
          SK: `user.id:${user_id}`,
        },
        UpdateExpression: `set #P1 = :P1, #P2 = :P2`,
        ExpressionAttributeNames: {
          "#P1": "password",
          "#P2": "reset_password_key",
        },
        ExpressionAttributeValues: {
          ":P1": new_password,
          ":P2": "",
        },
      });
    } catch (err) {
      throw err;
    }
  }
}
