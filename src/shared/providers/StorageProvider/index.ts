import { container } from "tsyringe";

import { StorageProviderLocal } from "./implementations/StorageProviderLocal";
import { StorageProviderS3 } from "./implementations/StorageProviderS3";
import { IStorageProvider } from "./IStorageProvider";

const storage = {
  LOCAL: StorageProviderLocal,
  S3: StorageProviderS3,
};

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  storage[process.env.STORAGE_PROVIDER as string]
);
