import { Coin, CoinMap, CoinMessage, ResultEnum } from "./interfaces/coin.interface";

export class CoinModule {
    private machineCoins: CoinMap = {};
    private userCoins: Coin[] = [];

    /**
     * @brief Init command initialises the machine storage with the given amount.
     * @param Coin coins - A list of coins.
     * @returns CoinMessage - Message indicates the operation is successful.
     */
    public initialiseMachine(coins: Coin[]): CoinMessage {
        this.insertCoins(coins);
        return {
            result: ResultEnum.Success
        };
    }

    /**
     * @brief Resets the API states.
     * @returns CoinMessage - Message indicates the operation is successful.
     */
    public reset(): CoinMessage {
        this.machineCoins = {};
        this.userCoins = [];
        return {
            result: ResultEnum.Success
        };
    }

    /**
     * @brief Registers the user coins.
     * @param Coin coins - A list of coins.
     * @returns CoinMessage - Message indicates the operation is successful.
     */
    public registerUserCoins(coins: Coin[]): CoinMessage {
        this.userCoins = this.insertCoins(coins);
        return {
            result: ResultEnum.Success
        };
    }

    /**
     * @brief Returns the correct change and reduces the coins from the machine.
     * @param Number productPrice - The price of a product.
     * @returns CoinMessage - Message indicates the operation is successful or not and the change as a list of coins.
     */
    public buy(productPrice: number): CoinMessage {
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
     * @returns CoinMessage - Message indicates the operation is successful or not.
     */
    public checkCoinAmount(coinType: number): CoinMessage {
        const coinAmount = this.machineCoins[coinType];
        if (!coinAmount) {
            return { result: ResultEnum.Error, message: `Coin type ${coinType} not found!` };
        }
        return { result: ResultEnum.Success, data: coinAmount };
    }

    /**
     * @brief Prints the contents of the machine.
     * @returns CoinMessage - Message indicates the operation is successful.
     */
    public printMachineCoins(): CoinMessage {
        console.log("Coins in the machine:");
        console.log(this.machineCoins);
        return {
            result: ResultEnum.Success
        };
    }

    private getChange(amount: number): Coin[] {
        const coinTypes = Object.keys(this.machineCoins);
        const coins = [];
        for (let index = amount-1; index > -1; index--) {
            const coin = coinTypes[index];
            const coinType = parseInt(coin, 10);
            const coinAmount = this.machineCoins[coin];
            const neededAmount = Math.floor(amount / coinType);
            const coinCount = (coinAmount - neededAmount) >= 0 ? neededAmount : coinAmount;
            amount -= coinCount * coinType;
            if (coinCount !== 0) {
                this.machineCoins[coin] -= coinCount;
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
        return (coins.map((coin) => coin.amount * coin.type)).reduce((c1, c2) => c1 + c2);
    }

    private returnUserCoins(): Coin[] {
        for (const coin of this.userCoins) {
            this.machineCoins[coin.type] -= coin.amount;
        }
        return this.userCoins;
    }

    private addCoinsBack(changes: Coin[]) {
        for (const coin of changes) {
            this.machineCoins[coin.type] += coin.amount;
        }
    }
}
