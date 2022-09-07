import { Injectable } from '@nestjs/common';
import { FileResponse } from "./dto/file.response";
import { format } from 'date-fns'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'

@Injectable()
export class FilesService {
  async saveFiles(files: Express.Multer.File[]): Promise<FileResponse[]> {
    const dateFolderName = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${path}/uploads/${dateFolderName}`;
    const res: FileResponse[] = [];

    await ensureDir(uploadFolder);

    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
      res.push({ url: `${dateFolderName}/${file.originalname}`, name: file.originalname });
    }

    return res;
  }
}
