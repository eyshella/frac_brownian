import { Point } from "models";

export class DensityGenerator {
  public static Generate(randomGenerator: () => number, numberOfRandomPoints: number, numberOfSteps: number) {
    const result: Array<Point> = []
    const normalArray: Array<number> = [];
    for (let i = 0; i < numberOfRandomPoints; i++) {
      normalArray.push(randomGenerator());
    }
    const sortedArray: Array<number> = normalArray.sort((a, b) => a - b);
    const max = sortedArray[sortedArray.length - 1];
    const min = sortedArray[0]
    const step = (Math.abs(max) + Math.abs(min)) / numberOfSteps;
    for (let j = 0; j < numberOfSteps + 1; j++) {
      result.push({
        x: step * j / max,
        y: 0
      });
    }

    let k = 0;
    while (k < sortedArray.length) {
      const element = sortedArray[k];
      const intevalNumber = Math.floor((element + Math.abs(min)) / step);
      result[intevalNumber].y = result[intevalNumber].y + 1;
      k = k + 1;
    }

    return result.map(item => ({
      x: item.x,
      y: item.y / numberOfRandomPoints
    }));
  }
}