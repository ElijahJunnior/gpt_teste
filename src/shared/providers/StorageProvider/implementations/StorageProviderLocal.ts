import fs from "fs";
import { resolve } from "path";
import { Readable } from "stream";

import { mainConfig } from "@config/mainConfig";

import { ACLType, IStorageProvider } from "../IStorageProvider";

class StorageProviderLocal implements IStorageProvider {
  async uploadFile(
    file: string,
    folder?: string | undefined,
    acl?: ACLType | undefined
  ): Promise<string> {
    const origin_path = resolve(mainConfig.temp_folder, file);

    const out_folder_full = resolve(mainConfig.temp_folder, folder ?? "");

    if (!fs.existsSync(out_folder_full)) {
      await fs.promises.mkdir(out_folder_full, { recursive: true });
    }

    const out_path = resolve(out_folder_full, file);

    await fs.promises.rename(origin_path, out_path);

    return file;
  }

  async delete(file: string, folder: string): Promise<void> {
    const path = resolve(mainConfig.temp_folder, folder, file);

    try {
      await fs.promises.stat(path);
    } catch {}

    await fs.promises.unlink(path);
  }

  async streamDownload(
    file: string,
    folder?: string | undefined
  ): Promise<Readable> {
    throw new Error("Method not implemented.");
  }
}

export { StorageProviderLocal };
