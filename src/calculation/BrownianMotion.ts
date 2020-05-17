import { Point } from "../renderer/models";
import { TimerUtils } from "../renderer/utils";

export class BrownianMotionCalculator {
  public static Calculate(H: number, T: number, m: number, M: number): Array<Point> {
    const randomArray: Array<number> = [];
    for (let i = 1; i <= m * (T + M) - 1; i++) {
      randomArray.push(this.NormalRandom());
    }

    const noiseArray: Array<number> = [];

    for (let j = 1; j <= T; j++) {
      noiseArray.push(this.BrownianNoise(H, m, M, randomArray, j));
    }

    const result = [
      {
        x: 0,
        y: 0
      }
    ];

    for (let i = 1 / T; i <= 1; i = i + 1 / T) {
      let noiseSum = 0;
      for (let j = 1; j <= Math.floor(i * T); j++) {
        noiseSum += noiseArray[j - 1];
      }
      result.push({
        x: i,
        y: Math.pow(T, -H) * noiseSum
      })
    }

    return result;
  }

  private static BrownianNoise(H: number, m: number, M: number, randomArray: Array<number>, j: number) {
    let result = 0;
    for (let n = 1; n <= M * m; n++) {
      result = result + this.BrownianNoiseKernel(n / m, H) * randomArray[(j + M) * m - n];
    }
    return result;
  }

  private static BrownianNoiseKernel(x: number, H: number) {
    if (x > 1) {
      return Math.pow(x, H - 0.5) - Math.pow(x - 1, H - 0.5);
    } else if (x > 0 && x <= 1) {
      return Math.pow(x, H - 0.5);
    }
    return 0;
  }

  private static NormalRandom() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }
}