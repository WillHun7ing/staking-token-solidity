import {ActionType} from "../action-types";

interface DepositAction {
    type: ActionType.DEPOSITE,
    payload: number,
}

interface WithdrawAction {
    type: ActionType.WITHDRAW,
    payload: number,
}

interface BankruptAction {
    type: ActionType.BANKRUPT,
}

export type Action = DepositAction | WithdrawAction | BankruptAction;
