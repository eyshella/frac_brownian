import { ipcRenderer } from 'electron';
import { BrownianMotionGenerator } from "./BrownianMotionGenerator";
import { IpcEvents } from '../models';
import { DensityGenerator } from './DensityGenerator';
import { NormalLawGenerator } from './NormalLawGenerator';

ipcRenderer.once(IpcEvents.WorkerStartFirstAlgorithm, (event, H: number, T: number, m: number, M: number) => {
  try {
    const result = BrownianMotionGenerator.Calculate(H, T, m, M);
    // const result = DensityGenerator.Generate(NormalLawGenerator.GenerateStandart, 1000000, 100);

    ipcRenderer.send(IpcEvents.WorkerResponseFirstAlgorithm, result);
  } catch (e) {
    alert(e);
  }
})

ipcRenderer.send(IpcEvents.WorkerLoaded);

