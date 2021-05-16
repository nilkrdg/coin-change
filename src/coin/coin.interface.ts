export interface Coin {
    type: number;
    amount: number;
}

export interface CoinMap {
    [coinValue: number]: number;
}

export interface CoinMessage {
    result: ResultEnum;
    message?: string;
    data?: Coin[];
}

export enum ResultEnum {
    Success = 'Success',
    Error = 'Error'
}
