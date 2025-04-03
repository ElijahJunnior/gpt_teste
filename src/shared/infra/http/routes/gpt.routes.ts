import { Router } from "express";
import fs from "fs";
import { loadEsm } from "load-esm";
import multer from "multer";
import OpenAI from "openai";
import sharp from "sharp";
import Stream from "stream";
import { v4 as uuid } from "uuid";

import { mainConfig } from "@config/mainConfig";
import multerImageUpload from "@config/multerImageUpload";

const uploadImage = multer(multerImageUpload);

// import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const gptRoutes = Router();

// POST
gptRoutes.post("/image/edit", uploadImage.single("img"), async (req, res) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? "", // Defina sua chave no .env
  });

  if (req.file == null) {
    return res.status(400).json({ error: "Image not found" });
  }

  let new_img_path = "";
  let mask_path = "";

  try {
    const original_img_buffer = fs.readFileSync(req.file.path);

    const new_img_buffer = await sharp(original_img_buffer)
      .resize(1024, 1024, {
        fit: "cover",
      })
      .ensureAlpha()
      .toFormat("png")
      .toBuffer();

    const { fileTypeFromBuffer } = await loadEsm<typeof import("file-type")>(
      "file-type"
    );

    const file_type = await fileTypeFromBuffer(new_img_buffer);

    const [, file_extension] = (file_type?.mime ?? "/").split("/");

    new_img_path = `${mainConfig.temp_folder}/${uuid()}.${file_extension}`;

    fs.writeFileSync(new_img_path, new_img_buffer);

    const { height, width } = await sharp(new_img_buffer).metadata();

    mask_path = `${mainConfig.temp_folder}/${uuid()}.png`;

    await sharp({
      create: {
        width: width ?? 1024,
        height: height ?? 1024,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .png()
      .toFile(mask_path);

    const img_buffer = fs.createReadStream(new_img_path);
    const mask_buffer = fs.createReadStream(mask_path);

    // prompt: "Transforme essa imagem em um estilo cyberpunk vibrante",

    const response = await openai.images.edit({
      image: img_buffer,
      mask: mask_buffer,
      prompt: "Transforme essa foto em ghibli",
      // model: "dall-e-2",
      // n: 1,
      size: "1024x1024",
    });

    // return res.status(201).json({});
    return res.status(201).json(response.data[0]);

    // res.setHeader("Content-Type", "image/png");
    // return res.send(new_img_buffer);
  } catch (error) {
    throw error;
  } finally {
    try {
      await fs.promises.unlink(req.file.path);
    } catch {
      console.log("Error deleting original image 3");
    }

    if (new_img_path.length > 0) {
      try {
        // await fs.promises.unlink(new_img_path);
      } catch {
        console.log("Error deleting original image 4");
      }
    }

    if (mask_path.length > 0) {
      try {
        // await fs.promises.unlink(new_img_path);
      } catch {
        console.log("Error deleting original image 4");
      }
    }
  }
});

gptRoutes.post("/image/create", async (req, res) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? "", // Defina sua chave no .env
  });

  const { prompt } = req.body as { prompt: string };

  if (prompt == null) {
    throw new Error("Prompt not found");
  }

  const response = await openai.images.generate({
    prompt,
    model: "dall-e-3",
    // n: 1,
    // size: "1024x1024",
  });

  // const response = await openai.images.generate({
  //   model: "dall-e-3",
  //   prompt: "Transforme essa imagem em um estilo cyberpunk vibrante",
  //   n: 1,
  //   size: "1024x1024",
  // });

  // Obtém a URL da imagem gerada
  const stylizedImageUrl = response.data[0].url;

  res.status(201).json({ stylizedImageUrl });
});

// teste 1
gptRoutes.get("/image/teste-1", async (req, res) => {
  const { temp_folder } = mainConfig;

  // cria um stream para ler o arquivo parte por parte
  const read_stream = fs.createReadStream(temp_folder + "/mica.png");

  // cria um PassThrough Stream, que age como um "tubo" para os dados
  // permite monitorar e manipular os dados antes de enviá-los.
  // ajuda no tratamento de erros e pode ser útil para modificar o fluxo de dados, se necessário.
  const pass_through = new Stream.PassThrough();

  // define o Content-Type baseado na extensão do arquivo
  res.setHeader("Content-Type", "image/png");

  // usa o stream.pipeline() para conecta no streams tratar erros
  // o pipeline lê o read_stream passa os dados pelo pass_through e chama a callback err caso necessário

  Stream.pipeline(read_stream, pass_through, (err) => {
    if (err != null) {
      console.error("Erro ao carregar imagem:", err);
      // retorna erro 404 se o arquivo não existir
      return res.sendStatus(404);
    }
  });

  // o stream pass_through (que contém os dados do arquivo) é enviado diretamente para o cliente.
  // o arquivo é transmitido diretamente para a resposta (res).
  // o cliente começa a receber os dados imediatamente, sem precisar esperar o arquivo inteiro ser lido.
  return pass_through.pipe(res);
});

// teste 2
gptRoutes.post(
  "/image/teste-2",
  uploadImage.single("img"),
  async (req, res) => {
    if (req.file == null) {
      return res.status(400).json({ error: "Image not found" });
    }

    let path_nova_imagem = "";

    try {
      const buffer_input = fs.readFileSync(req.file.path);

      const buffer_gba = await sharp(buffer_input)
        .resize(1024, 1024, {
          fit: "cover",
        })
        .ensureAlpha()
        .toFormat("png")
        .toBuffer();

      const { fileTypeFromBuffer } = await loadEsm<typeof import("file-type")>(
        "file-type"
      );

      const file_type = await fileTypeFromBuffer(buffer_gba);

      const [, file_extension] = (file_type?.mime ?? "/").split("/");

      path_nova_imagem = `${
        mainConfig.temp_folder
      }/${uuid()}.${file_extension}`;

      fs.writeFileSync(path_nova_imagem, buffer_gba);

      const read_stream = fs.createReadStream(path_nova_imagem);

      const pass_through = new Stream.PassThrough();

      res.setHeader("Content-Type", file_type?.mime ?? "");
      // image/jpeg

      Stream.pipeline(read_stream, pass_through, (err) => {
        if (err != null) {
          console.error("Erro ao carregar imagem:", err);
          return res.sendStatus(404);
        }
      });

      return pass_through.pipe(res);
    } catch (error) {
      throw error;
    } finally {
      try {
        await fs.promises.unlink(req.file.path);
      } catch {
        console.log("Error deleting original image 1");
      }

      try {
        if (path_nova_imagem.length > 0) {
          // await fs.promises.unlink(path_nova_imagem);
        }
      } catch {
        console.log("Error deleting original image 2");
      }
    }
  }
);

// teste 3
gptRoutes.get("/image/teste-3", async (req, res) => {
  const { temp_folder } = mainConfig;

  let path_nova_imagem = "";

  try {
    // cria um stream para ler o arquivo parte por parte
    const buffer_input = fs.readFileSync(temp_folder + "/mica.jpg");

    const buffer_gba = await sharp(buffer_input)
      .resize(1024, 1024, {
        fit: "cover",
      })
      .ensureAlpha()
      .toFormat("png")
      .toBuffer();

    const { fileTypeFromBuffer } = await loadEsm<typeof import("file-type")>(
      "file-type"
    );

    const file_type = await fileTypeFromBuffer(buffer_gba);

    const [, file_extension] = (file_type?.mime ?? "/").split("/");

    path_nova_imagem = `${mainConfig.temp_folder}/${uuid()}.${file_extension}`;

    fs.writeFileSync(path_nova_imagem, buffer_gba);

    const read_stream = fs.createReadStream(path_nova_imagem);

    const pass_through = new Stream.PassThrough();

    res.setHeader("Content-Type", file_type?.mime ?? "");
    // image/jpeg

    Stream.pipeline(read_stream, pass_through, (err) => {
      if (err != null) {
        console.error("Erro ao carregar imagem:", err);
        return res.sendStatus(404);
      }
    });

    return pass_through.pipe(res);
  } catch (error) {
    throw error;
  } finally {
    try {
      if (path_nova_imagem.length > 0) {
        // await fs.promises.unlink(path_nova_imagem);
      }
    } catch {
      console.log("Error deleting original image 2");
    }
  }
});

// GET

// PATCH

// PUT

// DELETE

export { gptRoutes };
