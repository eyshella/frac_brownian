import { ipcRenderer } from 'electron';
import { BrownianMotionCalculator } from "./BrownianMotion";
import { IpcEvents } from '../models';

ipcRenderer.once(IpcEvents.WorkerStartFirstAlgorithm, (event, H: number, T: number, m: number, M: number) => {
  const result = BrownianMotionCalculator.Calculate(H, T, m, M);
  ipcRenderer.send(IpcEvents.WorkerResponseFirstAlgorithm, result);
})

ipcRenderer.send(IpcEvents.WorkerLoaded);

