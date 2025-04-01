import { Request } from "express";
import { StorageEngine } from "multer";

import { CreateMultipartUploadCommandOutput, S3 } from "@aws-sdk/client-s3";
import { ACLType } from "@shared/providers/StorageProvider/IStorageProvider";

import { removeAccent } from "./removeAccent";
import { removeSpecialCharacter } from "./removeSpecialCharacter";
import { replaceSpaceCharacter } from "./replaceSpaceCharacter";

interface IStorageMulterToS3Options {
  acl?: ACLType;
  path?: string;
  createSafaFileName?: boolean;
}

export class StorageMulterToS3 implements StorageEngine {
  private readonly client: S3;
  private readonly bucket: string;
  private readonly region: string;
  private readonly acl: ACLType | undefined;
  private readonly path: string;
  private readonly createSafaFileName: boolean;

  constructor(options?: IStorageMulterToS3Options) {
    this.region = process.env.AWS_BUCKET_REGION ?? "";

    this.bucket = process.env.AWS_BUCKET ?? "";

    this.acl = options?.acl != null ? options?.acl : undefined;

    this.createSafaFileName =
      options?.createSafaFileName != null ? options?.createSafaFileName : true;

    this.client = new S3({
      region: this.region,
    });

    if (options?.path != null && options?.path !== "") {
      let path = options?.path.trim();

      path = path.startsWith("/")
        ? path.substring(1, Math.max(0, path.length))
        : path;

      path += !path.endsWith("/") ? "/" : "";

      this.path = path;
    } else {
      this.path = "";
    }
  }

  private async createMultipartUpload(
    key: string,
    contentType: string
  ): Promise<CreateMultipartUploadCommandOutput> {
    const result = await this.client.createMultipartUpload({
      Bucket: this.bucket,
      Key: key,
      ACL: this.acl,
      ContentType: contentType,
    });

    return result;
  }

  private handleFileKey(fileName: string): string {
    const nameSplitted = fileName.split(".");

    const indExtension = nameSplitted.length - 1;

    let fileExtension = "";

    if (nameSplitted.length > 0 && nameSplitted[indExtension] !== fileName) {
      fileExtension = nameSplitted[indExtension];
    }

    let safeFileName = fileName.substring(
      0,
      Math.min(fileName.length, fileName.length - (fileExtension.length + 1))
    );

    safeFileName = safeFileName.toLowerCase().trim();

    safeFileName = removeAccent(safeFileName);

    safeFileName = removeSpecialCharacter(safeFileName);

    safeFileName = replaceSpaceCharacter(safeFileName, "_");

    const fileHash =
      Date.now().toString() + "_" + Math.round(Math.random() * 1e9).toString();

    const key = safeFileName + "_" + fileHash + ("." + fileExtension);

    return key;
  }

  async _handleFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error?: unknown, info?: Partial<Express.Multer.File>) => void
  ): Promise<void> {
    try {
      const { originalname, mimetype, stream: readable } = file;
      const minSize = 5 * 1024 * 1024;
      let multipart = false;
      let buffer: Buffer | undefined;
      let part = 1;

      const filename = this.createSafaFileName
        ? this.handleFileKey(originalname)
        : originalname;

      const Key = this.path + filename;

      const multipartUpload = await this.createMultipartUpload(Key, mimetype);

      const uploadedParts: Array<{
        PartNumber: number;
        ETag: string | undefined;
      }> = [];

      const sendPartToS3 = async (): Promise<void> => {
        const uploadPromiseResult = await this.client.uploadPart({
          Body: buffer,
          Bucket: this.bucket,
          Key,
          PartNumber: part,
          UploadId: multipartUpload.UploadId,
        });

        uploadedParts.push({
          PartNumber: part,
          ETag: uploadPromiseResult.ETag,
        });

        part++;
        buffer = undefined;
      };

      readable.on("data", async (chunk: Buffer) => {
        try {
          readable.pause();

          if (buffer == null) {
            buffer = chunk;
          } else {
            buffer = Buffer.concat(
              [buffer, chunk],
              buffer.length + chunk.length
            );
          }

          if (buffer.length > minSize) {
            if (!multipart) {
              multipart = true;
            }

            await sendPartToS3();
          }

          readable.resume();
        } catch (err) {
          throw err;
        }
      });

      readable.on("end", async () => {
        try {
          if (multipart) {
            await sendPartToS3();

            await this.client.completeMultipartUpload({
              Bucket: this.bucket,
              Key,
              MultipartUpload: {
                Parts: uploadedParts,
              },
              UploadId: multipartUpload.UploadId,
            });
          } else {
            await this.client.putObject({
              Bucket: this.bucket,
              Key,
              ACL: this.acl,
              Body: buffer,
              ContentType: mimetype,
            });
          }
        } catch (err) {
          throw err;
        }

        callback(null, {
          ...file,
          destination: this.path,
          filename,
          path: Key,
          url: `https://${this.bucket}.s3.${this.region}.amazonaws.com/${Key}`,
        });
      });
    } catch (err) {
      callback(err);
    }
  }

  async _removeFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null) => void
  ): Promise<void> {
    try {
      await this.client.deleteObject({
        Bucket: this.bucket,
        Key: file.path,
      });
      callback(null);
    } catch (err) {
      callback(err);
    }
  }
}

export function storageS3(options?: IStorageMulterToS3Options): StorageEngine {
  const storage = new StorageMulterToS3(options);

  return storage;
}
