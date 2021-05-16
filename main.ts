import { ParsedCommand } from "./src/cli/cli.interface";
import { CLI } from "./src/cli/cli.module";
import { CoinModule } from "./src/coin/coin.module";

console.log('Welcome to Coin Change CLI!');
const coinModule = new CoinModule();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (inputBuffer: string) => {
    const command = CLI.parse(inputBuffer);
    if (command) {
        executeCommand(command);
    }
});

function executeCommand(command: ParsedCommand): void {
    switch (command.name) {
        case 'init': {
            const coinTypes = CLI.getCoinTypes(command);
            const coinAmount = CLI.getCoinAmount(command);
            coinModule.initialiseMachine(coinTypes as number[], coinAmount as number[]);
            coinModule.printMachineCoins();
        }
            break;
        case 'insert': {
            const coinTypes = CLI.getCoinTypes(command);
            const coinAmount = CLI.getCoinAmount(command);
            coinModule.registerUserCoins(coinTypes as number[], coinAmount as number[]);
            coinModule.printMachineCoins();
        }
            break;
        case 'buy': {
            const amount = CLI.getAmount(command);
            const changes = coinModule.buy(amount as number);
            console.log("Change:")
            console.log(changes);
            coinModule.printMachineCoins();
        }
            break;
        case 'help': {
            if (command.arguments.length === 0) {
                CLI.printAllCommands();
            } else {
                CLI.printCommand(command.arguments[0].name);
            }
        }
            break;
    }
}
