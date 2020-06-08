import fs from 'fs';
import { FileInfo } from '../models';

export interface GetJSONFileResult {
  json: any;
  fileInfo: FileInfo
}

export class JSONFileUtils {
  public static GetJSONFile(path: string, maxSize: Number): GetJSONFileResult {
    const result: GetJSONFileResult = {
      json: null,
      fileInfo: {
        filePath: path
      }
    }

    try {
      const stats = fs.statSync(path)
      const fileSizeInBytes = stats["size"]
      if (fileSizeInBytes < 20000000) {
        const fileContent = fs.readFileSync(path, 'utf8');
        const parsedFile = JSON.parse(fileContent);
        if (parsedFile == null) {
          throw new Error('Ошибка при десериализации JSON');
        }
        result.json = parsedFile;
      }

      result.fileInfo.fileSize = fileSizeInBytes;
    } catch (e) {
      throw new Error(`Ошибка при чтении JSON файла ${path}: ${e.message} ${e.stacktrace}`);
    }

    return result;
  }
}