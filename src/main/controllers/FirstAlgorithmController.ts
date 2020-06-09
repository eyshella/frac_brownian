import FirstAlgorithm from '!!raw-loader!../../calculation/FirstAlgorithm.py';
import { Base64FileUtils } from '../../utils/Base64FileUtils';

import { IpcEvents, StochasticProcessData, Base64FileInfo } from '../../models';
import { BasePythonController } from './BasePythonController';

export class FirstAlgorithmController extends BasePythonController {

  constructor() {
    super(IpcEvents.StartFirstAlgorithm, IpcEvents.StopFirstAlgorithm, IpcEvents.ResponseFirstAlgorithm, IpcEvents.UpdateFirstAlgorithm, FirstAlgorithm);
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

    if (parsedOutput.params && parsedOutput.params.covariance && parsedOutput.params.covariance.filePath) {
      const base64ImageInfo: Base64FileInfo = Base64FileUtils.GetFileAsBase64(parsedOutput.params.covariance.filePath);
      parsedOutput.params!.covariance = base64ImageInfo;
    }

    if (parsedOutput.params && parsedOutput.params.mean && parsedOutput.params.mean.filePath) {
      const base64ImageInfo: Base64FileInfo = Base64FileUtils.GetFileAsBase64(parsedOutput.params.mean.filePath);
      parsedOutput.params!.mean = base64ImageInfo;
    }

    return parsedOutput;
  }
}