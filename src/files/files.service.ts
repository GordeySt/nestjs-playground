import { Injectable } from '@nestjs/common';
import { FileResponse } from "./dto/file.response";
import { format } from 'date-fns'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'
import * as sharp from 'sharp'
import { MFile } from "./mfile.class";

@Injectable()
export class FilesService {
  async saveFile(file: Express.Multer.File): Promise<FileResponse[]> {
    const dateFolderName = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${path}/uploads/${dateFolderName}`;
    const res: FileResponse[] = [];

    const files = await this.FormFilesArray(file);

    await ensureDir(uploadFolder);

    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
      res.push({ url: `${dateFolderName}/${file.originalname}`, name: file.originalname });
    }

    return res;
  }

  async FormFilesArray(file: Express.Multer.File): Promise<MFile[]> {
    const files: MFile[] = [new MFile(file)];

    if (file.mimetype.includes('image')) {
      const buffer = await this.convertToWebp(file.buffer);
      files.push(new MFile({
        originalname: `${file.originalname.split('.')[0]}.webp`,
        buffer
      }))
    }

    return files;
  }

  convertToWebp(file: Buffer): Promise<Buffer> {
    return sharp(file)
      .webp()
      .toBuffer();
  }
}
