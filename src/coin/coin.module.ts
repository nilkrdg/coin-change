import { Coin, CoinMap } from "./coin.interface";

export class CoinModule {
    private machineCoins: CoinMap = {};
    private userCoins: Coin[] = [];

    public initialiseMachine(coinTypes: number[], coinAmounts: number[]): void {
        this.insertCoins(this.machineCoins, coinTypes, coinAmounts);
    }

    public registerUserCoins(coinTypes: number[], coinAmounts: number[]): void {
        this.userCoins = this.insertCoins(this.machineCoins, coinTypes, coinAmounts);
    }

    public buy(productPrice: number): Coin[] {
        if(this.userCoins.length === 0) {
           console.log('Not enough coin to purchase!');
           return this.returnUserCoins();
        }

        const userCoinSum = this.getCoinSum(this.userCoins);
        if(userCoinSum < productPrice) {
            console.log('Not enough coin to purchase!');
            return this.returnUserCoins();
        }

        const changeAmount =  userCoinSum - productPrice;
        const changes = this.getChange(changeAmount);
        let total = 0;
        for (const change of changes) {
            total += change.type *change.amount;
        }
        if (total !== changeAmount) {
            console.log('Not enough coins!');
            this.addCoinsBack(changes);
            return this.returnUserCoins();
        }
        this.userCoins = [];
        return changes;
    }

    public printMachineCoins(): void {
        console.log("Coins in the machine:");
        console.log(this.machineCoins);
    }

    private getChange(amount: number): Coin[] {
        const coinTypes = Object.keys(this.machineCoins).reverse();

        const changesArray = coinTypes.map(coin => {
            const coinType = parseInt(coin, 10);
            const coinAmount = this.machineCoins[coin];
            if (coinAmount === 0) {
                return {type: coinType, amount: 0};
            }
            const neededAmount = Math.floor(amount / coinType);
            const coinCount = (coinAmount - neededAmount) >= 0 ? neededAmount : coinAmount;
            amount -= coinCount * coinType;

            this.machineCoins[coin] -= coinCount;

            return {type: coinType, amount: coinCount};
        });

        return changesArray.filter((change) => change.amount !== 0);
    }

    private insertCoins(coinMap: CoinMap, coinTypes: number[], coinAmounts: number[]): Coin[] {
        if(coinTypes.length !== coinAmounts.length) {
            return;
        }
        const coins = [];
        for (let index = 0; index < coinTypes.length; index++) {
            const coinType = coinTypes[index];
            const coinAmount = coinAmounts[index];
            if(!coinMap[coinType]) {
                coinMap[coinType] = 0;
            }
            coinMap[coinType] += coinAmount;
            coins.push({type: coinType, amount: coinAmount});
        }
        return coins;
    }

    private getCoinSum(coins: Coin[]): number {
        return (coins.map((coin) => coin.amount * coin.type)).reduce((c1,c2)=> c1+c2);
    }

    private returnUserCoins(): Coin[] {
        for (const coin of this.userCoins) {
            this.machineCoins[coin.type] -= coin.amount;
        }
        return this.userCoins;
    }

    private addCoinsBack(changes: Coin[]){
        for (const coin of changes) {
            this.machineCoins[coin.type] += coin.amount;
        }
    }
}
