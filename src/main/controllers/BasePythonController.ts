import { PythonShell, Options, PythonShellError } from "python-shell";
import InstallPackages from '!!raw-loader!../../calculation/InstallPackages.py';
import { ipcMain, dialog, IpcMainEvent } from "electron";
import fs from 'fs';
import { IpcEvents } from "models";

export abstract class BasePythonController {
  constructor(
    private startIpcEvent: string,
    private stopIpcEvent: string,
    private finishIpcEvent: string,
    private updateIpcEvent: string,
    private pythonString: string
  ) { }

  protected worker?: PythonShell;
  protected firstRun = true;
  private stoped = false;
  protected event: IpcMainEvent | undefined;

  private installPackages = new Promise((resolve, reject) => {
    PythonShell.runString(InstallPackages, {}, (err, output) => {
      if (err != null) {
        reject(err);
      }
      resolve();
    })
  })

  protected clearWorker() {
    if (this.worker) {
      this.worker.kill();
      this.worker = undefined;
      this.event = undefined;
    }
  }

  protected async startWorker(event: any, ...args: Array<any>) {
    this.clearWorker();

    if (this.firstRun) {
      try {
        await this.installPackages;
      } catch (e) {
        dialog.showErrorBox('Error', 'Ошибка при получении пакетов python. Проверьте подключение к интернету и перезапустите приложение.')
        throw e;
      }
      this.firstRun = false;
    }

    const options: Options = {
      mode: 'text',
      args: args ? args.map(item => `${item}`) : undefined,
      pythonOptions: ['-u']
    };

    this.worker = PythonShell.runString(this.pythonString, options, (err: PythonShellError, output) => {
      let result = null

      try {
        if (err != null) {
          throw new Error(`Python ошибка при выполнении: ${err.message}\nPython stacktrace: ${err.traceback}`);
        }
        result = this.handlePythonResult(output)
      } catch (e) {
        this.handleError(e);
      }

      if (this.event != null) {
        this.event.sender.send(this.finishIpcEvent, result);
      }

      this.clearWorker();
    });

    this.worker.on('message', (message: string) => {
      let result = null;
      try {
        result = this.handlePythonMessage(message);
      } catch (e) {
        this.handleError(e);
      }

      if (this.event != null && result != null) {
        this.event.sender.send(this.updateIpcEvent, result);
      }
    });
  }

  protected handlePythonResult(output?: Array<string>):any {
    if (this.stoped) {
      this.stoped = false;
      return null;
    }
    if (output == null || output.length === 0) {
      throw new Error('Выходные данные равны null или пусты');
    }

    return output;
  }

  protected handlePythonMessage(message: string):any {
    if (this.stoped) {
      return null;
    }

    return message;
  }

  protected handleError(error: Error) {
    dialog.showErrorBox('Error', `${error.message}`);
  }

  public Start() {
    ipcMain.on(this.startIpcEvent, async (event: any, ...args) => {
      this.event = event;
      await this.startWorker(event, ...args)
    });

    ipcMain.on(this.stopIpcEvent, async (event: any) => {
      this.stoped = true;
      this.event = event;
      this.clearWorker();
    });
  }
}
