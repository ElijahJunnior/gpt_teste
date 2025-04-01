import fs from "fs";
import mime from "mime";
import { resolve } from "path";
import { Readable } from "stream";

import { S3 } from "@aws-sdk/client-s3";
import { mainConfig } from "@config/mainConfig";

import { ACLType, IStorageProvider, IUploadResult } from "../IStorageProvider";

class StorageProviderS3 implements IStorageProvider {
  private readonly client: S3;
  private readonly region: string;
  private readonly bucket_name: string;

  constructor() {
    this.region = process.env.AWS_BUCKET_REGION ?? "";

    this.client = new S3({
      region: this.region,
    });

    this.bucket_name = process.env.AWS_BUCKET as string;
  }

  private handlePath(file: string, folder?: string): string {
    folder = folder != null && folder.length > 0 ? folder + "/" : "";

    const path = file + folder;

    return path;
  }

  async uploadFile(
    file: string,
    folder?: string,
    ACL?: ACLType
  ): Promise<IUploadResult> {
    const file_path = resolve(mainConfig.temp_folder, file);

    const file_content = await fs.promises.readFile(file_path);

    const file_content_type = mime.getType(file_path);

    folder = folder != null && folder.length > 0 ? folder + "/" : "";

    const Key = this.handlePath(file, folder);

    await this.client.putObject({
      Bucket: this.bucket_name,
      Key,
      ACL,
      Body: file_content,
      ContentType: file_content_type ?? undefined,
    });

    await fs.promises.unlink(file_path);

    return {
      destination: folder,
      filename: file,
      path: Key,
      url: `https://${this.bucket_name}.s3.${this.region}.amazonaws.com/${Key}`,
    };
  }

  async delete(file: string, folder?: string): Promise<void> {
    const Key = this.handlePath(file, folder);

    await this.client.deleteObject({
      Bucket: this.bucket_name,
      Key,
    });
  }

  async streamDownload(file: string, folder?: string): Promise<Readable> {
    const Key = this.handlePath(file, folder);

    const res = await this.client.getObject({
      Key,
      Bucket: this.bucket_name,
    });

    if (res.Body == null) {
      throw new Error("AWS S3 - Error to get file by this key");
    }

    return res.Body as Readable;
  }
}

export { StorageProviderS3 };
