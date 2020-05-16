import { remote } from 'electron';

export class AlertUtils {
  public static ShowErrorAlert(text: string, title: string = 'Error') {
    try {
      remote.dialog.showErrorBox(title, text);
    } catch (e) {
      alert(`${title} - ${text}`);
    }
  }
}