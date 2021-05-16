export interface Coin {
    type: number;
    amount: number;
}

export interface CoinMap {
    [coinValue: number]: number;
}
