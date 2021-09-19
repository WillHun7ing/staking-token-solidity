import {combineReducers} from "redux";
import stakingReducer from "./stakingReducer";

const reducers = combineReducers({
    bank: stakingReducer
});

export default reducers;
export type RootState = ReturnType<typeof reducers>;