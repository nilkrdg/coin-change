import { Parser } from "../parser.module";

const validationTests = [
    {
        name: 'missing arguments for init',
        value: 'init',
    },
    {
        name: 'missing arguments for buy',
        value: 'buy',
    },
    {
        name: 'missing arguments for insert',
        value: 'insert',
    },
    {
        name: 'invalid arguments for init',
        value: 'init -ct a,b,c -ca 1,2,3',
    },
    {
        name: 'missing coin amount for init',
        value: 'init -ct 1 ',
    }
];

describe('Parser Tests', () => {
    for (const validationTest of validationTests) {
        it(validationTest.name, () => {
            const command = Parser.parse(validationTest.value);
            expect(command).toBe(null);
        });
    }
});

