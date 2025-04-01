import fs from "fs";
import { resolve } from "path";

import { mainConfig } from "@config/mainConfig";

async function cleanTempFiles(files: string[]): Promise<void> {
  for (const file of files) {
    const path = resolve(mainConfig.temp_folder, file);

    try {
      await fs.promises.stat(path);
    } catch {}

    await fs.promises.unlink(path);
  }
}

export { cleanTempFiles };
