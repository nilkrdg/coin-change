import { CoinModule } from "../coin.module";
import { ResultEnum } from "../coin.interface";

const coinValidationTests = [
    {
        name: 'validation for negative coin type',
        value: [{ type: -4, amount: 3 }],
    },
    {
        name: 'validation for negative coin amount',
        value: [{ type: 4, amount: -3 }],
    },
    {
        name: 'validation for 0 coin amount',
        value: [{ type: 4, amount: 0 }],
    },
    {
        name: 'validation for 0 coin type',
        value: [{ type: 0, amount: 1 }],
    }
];

const validationTests = [
    {
        name: 'validation for negative amount',
        value: -20,
    },
    {
        name: 'validation for 0 amount',
        value: 0,
    }
];

const coinModule = new CoinModule();

describe('Coin API Coin Validation Cases', () => {
    afterEach(() => {
        coinModule.reset();
    });

    for (const validationTest of coinValidationTests) {
        it(validationTest.name, () => {
            const registerUserCoinMessage = coinModule.initialiseMachine(validationTest.value);
            expect(registerUserCoinMessage.result).toBe(ResultEnum.Error);
            expect(registerUserCoinMessage.message).toBe(`Invalid coin!`);
        });
        it(validationTest.name, () => {
            const registerUserCoinMessage = coinModule.registerUserCoins(validationTest.value);
            expect(registerUserCoinMessage.result).toBe(ResultEnum.Error);
            expect(registerUserCoinMessage.message).toBe(`Invalid coin!`);
        });
    }
});


describe('Coin API Buy Validation Cases', () => {
    beforeEach(() => {
        coinModule.initialiseMachine([{ type: 1, amount: 10 }]);
        coinModule.registerUserCoins([{ type: 5, amount: 2 }]);
    });
    afterEach(() => {
        coinModule.reset();
    });
    for (const validationTest of validationTests) {
        it(validationTest.name, () => {
            const buyResultMessage = coinModule.buy(validationTest.value);
            expect(buyResultMessage.result).toBe(ResultEnum.Error);
            expect(buyResultMessage.message).toBe(`Invalid coin!`);
        });
    }
});
