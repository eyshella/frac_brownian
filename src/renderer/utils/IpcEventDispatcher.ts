import { ipcRenderer } from "electron";
import { ActionWithPayload, IpcEvents } from "../models";

export class IpcEventDispatcher {
  public static ProxyIpcEventToRedux(dispatch: (action: ActionWithPayload) => void) {
    for (let eventId in IpcEvents) {
      ipcRenderer.on(eventId, (event, ...args) => {
        dispatch({
          type: eventId,
          payload: args
        });
      })
    }
  }

  public static RemoveCallbacks() {
    for (let event in IpcEvents) {
      ipcRenderer.removeAllListeners(event);
    }
  }
}