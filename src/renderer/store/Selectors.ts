import { RootState } from "./RootReducer";

export const firstAlgorithmResultSelector = (state: RootState) => state.firstAlgorithmResult;
export const firstAlgorithmParamsSelector = (state: RootState) => state.firstAlgorithmParams;
export const firstAlgorithmLoadingSelector = (state: RootState) => state.firstAlgorithmLoading;

export const secondAlgorithmResultSelector = (state: RootState) => state.secondAlgorithmResult;
export const secondAlgorithmParamsSelector = (state: RootState) => state.secondAlgorithmParams;
export const secondAlgorithmLoadingSelector = (state: RootState) => state.secondAlgorithmLoading;

export const isInfoModalOpenSelector = (state:RootState) => state.isInfoModalOpen;
export const infoModalTitleSelector = (state:RootState) => state.infoModalTitle;
export const infoModalDescriptionSelector = (state:RootState) => state.infoModalDescription;