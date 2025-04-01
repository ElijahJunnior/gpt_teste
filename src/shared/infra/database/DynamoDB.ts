import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const dynamoDB = DynamoDBDocument.from(
  new DynamoDB({
    region: process.env.AWS_DYNAMO_REGION,
  })
);

const TableName = process.env.AWS_DYNAMO_TABLE_NAME as string;
const minDateValue = "1850-01-01T00:00:00.001Z";
const pageSize = Number(process.env?.AWS_DYNAMO_PAGE_SIZE ?? "50");

export { dynamoDB, TableName, minDateValue, pageSize };
