import { ipcMain, IpcMainEvent } from 'electron';
import fs, { WriteStream } from 'fs';
import { IpcEvents } from '../../models';
import archiver from 'archiver';

export class SaveFileController {

  private copyFile(event: IpcMainEvent, from: string, to: string) {
    fs.copyFile(from, to, () => {
      event.sender.send(IpcEvents.CopyFileFinished);
    });
  }

  private copyFilesAsArray(event: IpcMainEvent, from: string[], to: string) {
    const output: WriteStream = fs.createWriteStream(to);
    const archive: archiver.Archiver = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    archive.pipe(output);

    for (let i = 0; i < from.length; i++) {
      const filePath = from[i];
      archive.append(fs.createReadStream(filePath), { name: `${i}.json` });
    }

    archive.finalize();
  }

  public Start() {
    ipcMain.on(IpcEvents.CopyFile, async (event: IpcMainEvent, from: string, to: string) => {
      await this.copyFile(event, from, to);
    });

    ipcMain.on(IpcEvents.CopyFilesAsZip, async (event: IpcMainEvent, from: string[], to: string) => {
      await this.copyFilesAsArray(event, from, to);
    });
  }
}
