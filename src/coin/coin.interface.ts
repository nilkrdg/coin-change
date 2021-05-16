export interface Coin {
    type: number;
    amount: number;
}

export interface CoinMap {
    [coinValue: number]: number;
}

export interface CoinResponse {
    result: ResultEnum;
    message?: string;
    data?: Coin[] | number;
}

export enum ResultEnum {
    Success = 'Success',
    Error = 'Error'
}
