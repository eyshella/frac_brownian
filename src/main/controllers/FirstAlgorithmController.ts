import { ipcMain,dialog, BrowserWindow } from 'electron';
import { IpcEvents, Point } from '../../models';

export class FirstAlgorithmController {
  private worker?: BrowserWindow;

  public Start() {
    ipcMain.on(IpcEvents.StartFirstAlgorithm, async (event: any, H: number, T: number, m: number, M: number) => {

      this.worker = new BrowserWindow({
        show: false,
        webPreferences: { nodeIntegration: true }
      });

      ipcMain.once(IpcEvents.WorkerResponseFirstAlgorithm, (e, result: Array<Point>) => {
        event.sender.send(IpcEvents.ResponseFirstAlgorithm, result);
        if (this.worker) {
          this.worker.close();
        }
      })

      ipcMain.once(IpcEvents.WorkerLoaded, (event: Electron.IpcMainEvent) => {
        event.sender.send(IpcEvents.WorkerStartFirstAlgorithm, H, T, m, M);
      })

      this.worker.loadFile('./calculation.html');
    });

    ipcMain.on(IpcEvents.StopFirstAlgorithm, async (event: any) => {
      if (this.worker) {
        this.worker.close();
        ipcMain.removeAllListeners(IpcEvents.WorkerResponseFirstAlgorithm);
        ipcMain.removeAllListeners(IpcEvents.WorkerLoaded);
      }
    });
  }
}