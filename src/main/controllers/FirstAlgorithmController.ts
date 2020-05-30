import FirstAlgorithm from '!!raw-loader!../../calculation/FirstAlgorithm.py';
import InstallPackages from '!!raw-loader!../../calculation/InstallPackages.py';

import { ipcMain } from 'electron';
import { Options, PythonShell } from 'python-shell';
import { dialog } from 'electron';
import { IpcEvents } from '../../models';

export class FirstAlgorithmController {
  private worker?: PythonShell;
  private firstRun = true;

  private clearWorker() {
    if (this.worker) {
      this.worker.kill();
      this.worker = undefined;
    }
  }

  private installPackages = new Promise((resolve, reject) => {
    PythonShell.runString(InstallPackages, undefined, (err, output) => {
      if (err != null) {
        reject(err);
      }
      resolve();
    })
  })

  public Start() {
    ipcMain.on(IpcEvents.StartFirstAlgorithm, async (event: any, H: number, T: number, m: number, M: number) => {
      this.clearWorker();

      const options: Options = {
        mode: 'text',
        args: [H, T, m, M].map(item => `${item}`)
      };
      if (this.firstRun) {
        try {
          await this.installPackages;
        } catch (e) {
          dialog.showErrorBox('Error','Ошибка при получении пакетов python. Проверьте подключение к интернету и перезапустите приложение.')
          throw e;
        }
        this.firstRun = false;
      }
      this.worker = PythonShell.runString(FirstAlgorithm, options, (err, output) => {
        if (err != null) {
          return;
        }

        if (output == null || output.length === 0) {
          return
        }

        const parsedOutput = JSON.parse(output[output.length - 1]);
        if (parsedOutput == null) {
          return;
        }

        if (parsedOutput.result == null) {
          return
        }

        event.sender.send(IpcEvents.ResponseFirstAlgorithm, parsedOutput.result);
        this.clearWorker();
      });
    });

    ipcMain.on(IpcEvents.StopFirstAlgorithm, async (event: any) => {
      this.clearWorker();
    });
  }
}