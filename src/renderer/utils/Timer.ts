export class TimerUtils {

  public static async RunAsyncTimer(timeMs: number): Promise<boolean> {
    const timerPromise: Promise<void> = new Promise((resolve, reject) => {
      try {
        setTimeout(resolve, timeMs)
      } catch (e) {
        reject();
      }
    });

    await timerPromise;
    return true;
  }
} 