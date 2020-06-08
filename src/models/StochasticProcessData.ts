import { Point } from "./Point";
import { FileInfo } from "./FileInfo";
import { Base64FileInfo } from "./Base64FileInfo";

export interface StochasticProcessData {
  paths: Array<Base64FileInfo>
  image?: Base64FileInfo
  params?: StochasticProcessCalculatedParams
}


export interface StochasticProcessCalculatedParams {
  mean:number
}