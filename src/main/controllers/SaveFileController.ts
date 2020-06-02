import { ipcMain, IpcMainEvent } from 'electron';
import fs from 'fs';
import { IpcEvents } from '../../models';

export class SaveFileController {

  private copyFile(event: IpcMainEvent, from: string, to: string) {
    fs.copyFile(from, to, () => {
      event.sender.send(IpcEvents.CopyFileFinished);
    });
  }

  public Start() {
    ipcMain.on(IpcEvents.CopyFile, async (event: IpcMainEvent, from: string, to: string) => {
      await this.copyFile(event, from, to);
    });
  }
}
