import { RootState } from "./RootReducer";

export const firstAlgorithmResultSelector = (state: RootState) => state.firstAlgorithmResult;

export const firstAlgorithmParamsSelector = (state: RootState) => state.firstAlgorithmParams;

export const firstAlgorithmLoadingSelector = (state: RootState) => state.firstAlgorithmLoading;