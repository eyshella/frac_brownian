import SecondAlgorithm from '!!raw-loader!../../calculation/SecondAlgorithm.py';
import { Base64FileUtils } from '../../utils/Base64FileUtils';

import { Base64FileInfo, IpcEvents, StochasticProcessData } from '../../models';
import { BasePythonController } from './BasePythonController';

export class SecondAlgorithmController extends BasePythonController {

  constructor() {
    super(IpcEvents.StartSecondAlgorithm, IpcEvents.StopSecondAlgorithm, IpcEvents.ResponseSecondAlgorithm, IpcEvents.UpdateSecondAlgorithm, SecondAlgorithm);
  }

  protected handlePythonResult(output?: Array<string>): any {
    const data = super.handlePythonResult(output);
    if (data == null || data.length === 0) {
      return undefined;
    }

    let parsedOutput: StochasticProcessData = JSON.parse(data);
    if (parsedOutput == null) {
      throw new Error('Ошибка при десериализации JSON');
    }

    if (parsedOutput.image && parsedOutput.image.filePath) {
      const base64ImageInfo: Base64FileInfo = Base64FileUtils.GetFileAsBase64(parsedOutput.image.filePath);
      parsedOutput.image = base64ImageInfo;
    }
    return parsedOutput;
  }
}