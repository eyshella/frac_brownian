import FirstAlgorithm from '!!raw-loader!../../calculation/FirstAlgorithm.py';

import { IpcEvents } from '../../models';
import { BasePythonController } from './BasePythonController';

export class FirstAlgorithmController extends BasePythonController {

  constructor() {
    super(IpcEvents.StartFirstAlgorithm, IpcEvents.StopFirstAlgorithm,IpcEvents.ResponseFirstAlgorithm, FirstAlgorithm);
  }
}