export interface SecondAlgorithmParams {
  TettaParam: string;
  HParam: string;
  timeoutSeconds: string;
  //lawParam: SecondAlgorithmLaw;
}

export enum SecondAlgorithmLaw {
  Normal = 'Normal',
  LogNormal = 'LogNormal',
  Poisson = 'Poisson'
}

export function MakeSecondAlgorithmLawReadable(v: SecondAlgorithmLaw): string {
  switch (v) {
    case SecondAlgorithmLaw.LogNormal:
      return 'Log-Normal';
    default:
      return v;
  }
}