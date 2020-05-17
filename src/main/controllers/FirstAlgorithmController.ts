import { ipcMain, dialog, BrowserWindow } from 'electron';
import { IpcEvents, Point } from '../../models';

export class FirstAlgorithmController {
  private worker?: BrowserWindow;

  public Start() {
    ipcMain.on(IpcEvents.StartFirstAlgorithm, async (event: any, H: number, T: number, m: number, M: number) => {
      if (this.worker) {
        this.worker.close();
        this.worker = undefined;
        ipcMain.removeAllListeners(IpcEvents.WorkerResponseFirstAlgorithm);
        ipcMain.removeAllListeners(IpcEvents.WorkerLoaded);
      }

      this.worker = new BrowserWindow({
        show: false,
        webPreferences: { nodeIntegration: true }
      });

      ipcMain.once(IpcEvents.WorkerResponseFirstAlgorithm, (workerEvent: Electron.IpcMainEvent, result: Array<Point>) => {
        if (event) {
          event.sender.send(IpcEvents.ResponseFirstAlgorithm, result);
        }
        if (this.worker) {
          this.worker.close();
          this.worker = undefined;
        }
      })

      ipcMain.once(IpcEvents.WorkerLoaded, (workerEvent: Electron.IpcMainEvent) => {
        workerEvent.sender.send(IpcEvents.WorkerStartFirstAlgorithm, H, T, m, M);
      })

      this.worker.loadFile('./calculation.html');
    });

    ipcMain.on(IpcEvents.StopFirstAlgorithm, async (event: any) => {
      if (this.worker) {
        this.worker.close();
        this.worker = undefined;
        ipcMain.removeAllListeners(IpcEvents.WorkerResponseFirstAlgorithm);
        ipcMain.removeAllListeners(IpcEvents.WorkerLoaded);
      }
    });
  }
}