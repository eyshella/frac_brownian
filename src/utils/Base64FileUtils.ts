import fs from 'fs';
import { FileInfo, Base64FileInfo } from '../models';


export class Base64FileUtils {
  public static GetFileAsBase64(path: string): Base64FileInfo {
    const result: Base64FileInfo = {
      base64: '',
      filePath: path
    }

    try {
      const stats = fs.statSync(path)
      const fileSizeInBytes = stats["size"]

      const fileContent = fs.readFileSync(path, 'base64');
      result.base64 = fileContent;
      result.fileSize = fileSizeInBytes;
    } catch (e) {
      throw new Error(`Ошибка при чтении BASE64 из файла ${path}: ${e.message} ${e.stacktrace}`);
    }

    return result;
  }
}