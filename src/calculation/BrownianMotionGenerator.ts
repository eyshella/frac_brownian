import { Point } from "../renderer/models";
import { NormalLawGenerator } from "./NormalLawGenerator";

export class BrownianMotionGenerator {
  public static Calculate(H: number, T: number, m: number, M: number): Array<Point> {
    const randomArray: Array<number> = [];
    for (let i = 1; i <= m * (T + M) - 1; i++) {
      randomArray.push(NormalLawGenerator.GenerateStandart());
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
}