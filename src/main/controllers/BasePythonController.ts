import { PythonShell, Options, PythonShellError } from "python-shell";
import InstallPackages from '!!raw-loader!../../calculation/InstallPackages.py';
import { ipcMain, dialog } from "electron";
import fs from 'fs';
import { IpcEvents } from "models";

export abstract class BasePythonController {
  constructor(
    private startIpcEvent: string,
    private stopIpcEvent: string,
    private resultIpcEvent: string,
    private pythonString: string
  ) { }

  protected worker?: PythonShell;
  protected firstRun = true;
  private stoped = false;

  private installPackages = new Promise((resolve, reject) => {
    PythonShell.runString(InstallPackages, undefined, (err, output) => {
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
    }
  }

  protected async startWorker(event: Electron.IpcMainEvent, ...args: Array<any>) {
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
      args: args ? args.map(item => `${item}`) : undefined
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
      event.sender.send(this.resultIpcEvent, result);
      this.clearWorker();
    });
  }


  protected handlePythonResult(output?: Array<string>) {
    if (this.stoped) {
      this.stoped = false;
      return null;
    }
    if (output == null || output.length === 0) {
      throw new Error('Выходные данные равны null или пусты');
    }

    let parsedOutput = JSON.parse(output[output.length - 1]);
    if (parsedOutput == null) {
      throw new Error('Ошибка при десериализации JSON');
    }

    if (parsedOutput.filePath != null) {
      try {
        const stats = fs.statSync(parsedOutput.filePath)
        const fileSizeInBytes = stats["size"]

        if (fileSizeInBytes < 20000000) {
          const fileContent = fs.readFileSync(parsedOutput.filePath, 'utf8');
          const parsedFile = JSON.parse(fileContent);
          if (parsedFile == null) {
            throw new Error('Ошибка при десериализации JSON');
          }
          parsedOutput = {
            ...parsedOutput,
            ...parsedFile,
          }
        }

        parsedOutput.fileSize=fileSizeInBytes;
      } catch (e) {
        throw new Error(`Ошибка при чтении JSON файла ${parsedOutput.filePath}: ${e.message} ${e.stacktrace}`);
      }
    }

    return parsedOutput;
  }

  protected handleError(error: Error) {
    dialog.showErrorBox('Error', `${error.message}`);
  }

  public Start() {
    ipcMain.on(this.startIpcEvent, async (event: any, ...args) => {
      await this.startWorker(event, ...args)
    });

    ipcMain.on(this.stopIpcEvent, async (event: any) => {
      this.stoped = true;
      this.clearWorker();
    });
  }
}
