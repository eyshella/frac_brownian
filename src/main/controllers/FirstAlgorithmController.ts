import FirstAlgorithm from '!!raw-loader!../../calculation/FirstAlgorithm.py';
import { ipcMain } from 'electron';
import { Options, PythonShell } from 'python-shell';

import { IpcEvents } from '../../models';

export class FirstAlgorithmController {
  private worker?: PythonShell;

  private clearWorker() {
    if (this.worker) {
      this.worker.kill();
      this.worker = undefined;
    }
  }

  public Start() {
    ipcMain.on(IpcEvents.StartFirstAlgorithm, async (event: any, H: number, T: number, m: number, M: number) => {
      this.clearWorker();

      const options: Options = {
        mode: 'text',
        args: [H, T, m, M].map(item => `${item}`)
      };

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