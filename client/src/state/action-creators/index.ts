import { Dispatch } from "redux";
import { ActionType } from "../action-types"
import { Action } from "../actions/index";

export const depositMoney = (amount: number) => {
    return (dispatch: Dispatch<Action>) => {
        dispatch(({
            type: ActionType.DEPOSITE,
            payload: amount,
        }))
    }
}

export const withdrawMoney = (amount: number) => {
    return (dispatch: Dispatch<Action>) => {
        dispatch(({
            type: ActionType.WITHDRAW,
            payload: amount,
        }))
    }
}

export const bankrupt = (amount: number) => {
    return (dispatch: Dispatch<Action>) => {
        dispatch(({
            type: ActionType.BANKRUPT,
        }))
    }
}