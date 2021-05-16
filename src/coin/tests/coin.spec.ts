import { CoinModule } from "../coin.module";
import { ResultEnum } from "../interfaces/coin.interface";

const coinModule = new CoinModule();
describe('Coin API Success Cases', () => {
    beforeAll(() => {
        const machineCoins = [{type: 1, amount: 3}, {type: 2, amount: 2}, {type: 5, amount: 1}];
        coinModule.initialiseMachine(machineCoins);
      });
      afterAll(() => {
        coinModule.reset();
      });
    it('checks if the machine is initialised correctly', () => {
        const checkCoinMessage1 = coinModule.checkCoinAmount(1);
        const checkCoinMessage2 = coinModule.checkCoinAmount(2);
        const checkCoinMessage5 = coinModule.checkCoinAmount(5);
        expect(checkCoinMessage1.data).toBe(3);
        expect(checkCoinMessage2.data).toBe(2);
        expect(checkCoinMessage5.data).toBe(1);
    });

    it('registers user coins correctly', () => {
        const userCoins = [{type: 5, amount: 2}];
        const coinInsertMessage = coinModule.registerUserCoins(userCoins);
        expect(coinInsertMessage.result).toBe(ResultEnum.Success);
        const checkCoinMessage5 = coinModule.checkCoinAmount(5);
        expect(checkCoinMessage5.data).toBe(3);
    });

    it('should return correct change', () => {
        const userCoins = [{type: 5, amount: 2}];
        coinModule.registerUserCoins(userCoins);
        const changeMessage = coinModule.buy(7);
        expect(changeMessage.result).toBe(ResultEnum.Success);
        expect(changeMessage.data).toEqual([ { type: 2, amount: 1 }, { type: 1, amount: 1 } ]);
    });

    it('should reset API state', () => {
        coinModule.reset();
        const checkCoinMessage = coinModule.checkCoinAmount(5);
        expect(checkCoinMessage.result).toBe(ResultEnum.Error);
        expect(checkCoinMessage.message).toBe('Coin type 5 not found!');
    });
});

describe('Coin API Error Cases', () => {
    beforeAll(() => {
        const machineCoins = [{type: 1, amount: 1}, {type: 5, amount: 4}];
        coinModule.initialiseMachine(machineCoins);
      });
      afterAll(() => {
        coinModule.reset();
      });
    it('should return Not enough coins!', () => {
        const userCoins = [{type: 5, amount: 2}];
        coinModule.registerUserCoins(userCoins);
        const changeMessage = coinModule.buy(7);
        expect(changeMessage.result).toBe(ResultEnum.Error);
        expect(changeMessage.message).toBe('Not enough coins!');
    });

    it('should return Not enough coin to purchase!', () => {
        const userCoins = [{type: 5, amount: 1}];
        coinModule.registerUserCoins(userCoins);
        const changeMessage = coinModule.buy(7);
        expect(changeMessage.result).toBe(ResultEnum.Error);
        expect(changeMessage.message).toBe('Not enough coin to purchase!');
    });

    it('should return coin type not found!', () => {
        const checkCoinMessage = coinModule.checkCoinAmount(2);
        expect(checkCoinMessage.result).toBe(ResultEnum.Error);
        expect(checkCoinMessage.message).toBe(`Coin type 2 not found!`);
    });
});


describe('Coin API Stress Cases', () => {
    beforeAll(() => {
        const machineCoins = [];
        for(let i = 1; i < 15000; i++) {
            machineCoins .push({type: i, amount: 10});
        }
        coinModule.initialiseMachine(machineCoins);
      });
      afterAll(() => {
        coinModule.reset();
      });

    it('should return correct change', () => {
        const userCoins = [{type: 5, amount: 2}];
        coinModule.registerUserCoins(userCoins);
        const changeMessage = coinModule.buy(7);
        expect(changeMessage.result).toBe(ResultEnum.Success);
        expect(changeMessage.data).toEqual([ { type: 3, amount: 1 }]);
    });
});
