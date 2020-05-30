import SecondAlgorithm from '!!raw-loader!../../calculation/SecondAlgorithm.py';

import { IpcEvents } from '../../models';
import { BasePythonController } from './BasePythonController';

export class SecondAlgorithmController extends BasePythonController {

  constructor() {
    super(IpcEvents.StartSecondAlgorithm, IpcEvents.StopSecondAlgorithm,IpcEvents.ResponseSecondAlgorithm, SecondAlgorithm);
  }
}