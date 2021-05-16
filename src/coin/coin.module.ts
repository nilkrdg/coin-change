import { Coin, CoinMap, CoinResponse, ResultEnum } from "./coin.interface";

export class CoinModule {
    private machineCoins: CoinMap = {};
    private userCoins: Coin[] = [];

    /**
     * @brief Init command initialises the machine storage with the given amount.
     * @param Coin coins - A list of coins.
     * @returns CoinResponse - Message indicates the operation is successful.
     */
    public initialiseMachine(coins: Coin[]): CoinResponse {
        this.machineCoins = {};
        const validationResult = this.validateCoins(coins);
        if(validationResult.result === ResultEnum.Error) {
            return validationResult;
        }
        this.insertCoins(coins);
        return {
            result: ResultEnum.Success
        };
    }

    /**
     * @brief Resets the API states.
     * @returns CoinResponse - Message indicates the operation is successful.
     */
    public reset(): CoinResponse {
        this.machineCoins = {};
        this.userCoins = [];
        return {
            result: ResultEnum.Success
        };
    }

    /**
     * @brief Registers the user coins.
     * @param Coin coins - A list of coins.
     * @returns CoinResponse - Message indicates the operation is successful.
     */
    public registerUserCoins(coins: Coin[]): CoinResponse {
        const validationResult = this.validateCoins(coins);
        if(validationResult.result === ResultEnum.Error) {
            return validationResult;
        }
        const userCoins = this.insertCoins(coins);
        for (const coin of userCoins) {
            const addedCoin = this.userCoins.find((c) => c.type === coin.type);
            if (addedCoin) {
                coin.amount += addedCoin.amount;
            } else {
                this.userCoins.push(coin);
            }
        }
        return {
            result: ResultEnum.Success
        };
    }

    /**
     * @brief Prints the user coins.
     * @returns CoinResponse - Message indicates the operation is successful.
     */
    public printUserCoins(): CoinResponse {
        console.log("Coins inserted by user:");
        console.log(this.userCoins);
        return {
            result: ResultEnum.Success
        };
    }

    /**
     * @brief Returns the correct change and reduces the coins from the machine.
     * @param Number productPrice - The price of a product.
     * @returns CoinResponse - Message indicates the operation is successful or not and the change as a list of coins.
     */
    public buy(productPrice: number): CoinResponse {
        const validationResult = this.validateAmount(productPrice);
        if(validationResult.result === ResultEnum.Error) {
            return validationResult;
        }
        const userCoinSum = this.getCoinSum(this.userCoins);
        if (this.userCoins.length === 0 || userCoinSum < productPrice) {
            return {
                result: ResultEnum.Error,
                message: 'Not enough coin to purchase!',
                data: this.returnUserCoins()
            };
        }

        const changeAmount = userCoinSum - productPrice;
        const changes = this.getChange(changeAmount);
        let total = 0;
        for (const change of changes) {
            total += change.type * change.amount;
        }
        if (total !== changeAmount) {
            this.addCoinsBack(changes);
            return {
                result: ResultEnum.Error,
                message: 'Not enough coins!',
                data: this.returnUserCoins()
            };
        }
        this.userCoins = [];
        return { result: ResultEnum.Success, data: changes };
    }

    /**
     * @brief Returns the amount of the specified coin.
     * @param Number coinType - Coin type.
     * @returns CoinResponse - Message indicates the operation is successful or not.
     */
    public checkCoinAmount(coinType: number): CoinResponse {
        const coinAmount = this.machineCoins[coinType];
        if (!coinAmount) {
            return { result: ResultEnum.Error, message: `Coin type ${coinType} not found!` };
        }
        return { result: ResultEnum.Success, data: coinAmount };
    }

    /**
     * @brief Prints the contents of the machine.
     * @returns CoinResponse - Message indicates the operation is successful.
     */
    public printMachineCoins(): CoinResponse {
        console.log("Coins in the machine:");
        console.log(this.machineCoins);
        return {
            result: ResultEnum.Success
        };
    }

    private getChange(amount: number): Coin[] {
        const coinTypes = Object.keys(this.machineCoins);
        const coins = [];
        const biggestCoin = parseInt(coinTypes[coinTypes.length - 1], 10);
        const startValue = (amount - 1) > biggestCoin ? biggestCoin : (amount - 1);
        for (let index = startValue; index > -1; index--) {
            const coin = coinTypes[index];
            if (!coin) {
                continue;
            }
            const coinType = parseInt(coin, 10);
            const coinAmount = this.machineCoins[coin];
            const neededAmount = Math.floor(amount / coinType);
            const coinCount = (coinAmount - neededAmount) >= 0 ? neededAmount : coinAmount;
            amount -= coinCount * coinType;
            if (coinCount !== 0) {
                this.removeCoinFromMachine({ type: parseInt(coin, 10), amount: coinCount });
                coins.push({ type: coinType, amount: coinCount });
            }
        }
        return coins;
    }

    private insertCoins(coins: Coin[]): Coin[] {
        for (const coin of coins) {
            if (!this.machineCoins[coin.type]) {
                this.machineCoins[coin.type] = 0;
            }
            this.machineCoins[coin.type] += coin.amount;
        }
        return coins;
    }

    private getCoinSum(coins: Coin[]): number {
        if (coins.length === 0) {
            return 0;
        }
        return (coins.map((coin) => coin.amount * coin.type)).reduce((c1, c2) => c1 + c2);
    }

    private returnUserCoins(): Coin[] {
        for (const coin of this.userCoins) {
            this.removeCoinFromMachine(coin);
        }
        const userCoins = this.userCoins;
        this.userCoins = [];
        return userCoins;
    }

    private addCoinsBack(changes: Coin[]) {
        for (const coin of changes) {
            this.machineCoins[coin.type] += coin.amount;
        }
    }

    private removeCoinFromMachine(coin: Coin): void {
        if (this.machineCoins[coin.type]) {
            this.machineCoins[coin.type] -= coin.amount;
            if (this.machineCoins[coin.type] === 0) {
                delete this.machineCoins[coin.type];
            }
        }
    }

    private validateCoins(coins: Coin[]): CoinResponse {
        for (const coin of coins) {
            if(!this.validateValue(coin.type) || !this.validateValue(coin.amount)) {
                return {
                    result: ResultEnum.Error,
                    message: 'Invalid coin!',
                };
            }
        }
        return {
            result: ResultEnum.Success,
        };
    }

    private validateAmount(amount: number): CoinResponse {
            if(!this.validateValue(amount)) {
                return {
                    result: ResultEnum.Error,
                    message: 'Invalid coin!',
                };
            }

        return {
            result: ResultEnum.Success,
        };
    }

    private validateValue(value: number): boolean {
        return !(isNaN(value) || value < 0 || value === 0);
    }
}
