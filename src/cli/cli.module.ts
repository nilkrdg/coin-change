import { ResultEnum } from "../coin/interfaces/coin.interface";
import { CoinModule } from "../coin/coin.module";
import { Parser } from "../parser/parser.module";
import { COMMAND_DICTIONARY } from "./constants/command-dictionary";

export class CLI {
    private coinModule = new CoinModule();

    public executeCommand(commandString: string): void {
        const command = Parser.parse(commandString);
        if (!command) {
            return;
        }
        switch (command.name) {
            case 'init': {
                const coins = Parser.getCoins(command);
                const resultMessage = this.coinModule.initialiseMachine(coins);
                console.log(resultMessage.result);
                this.coinModule.printMachineCoins();
                break;
            }
            case 'insert': {
                const coins = Parser.getCoins(command);
                const resultMessage = this.coinModule.registerUserCoins(coins);
                console.log(resultMessage.result);
                this.coinModule.printMachineCoins();
                break;
            }
            case 'buy': {
                const amount = Parser.getAmount(command);
                const resultMessage = this.coinModule.buy(amount as number);
                console.log(resultMessage.result);
                if (resultMessage.result === ResultEnum.Error) {
                    console.error(resultMessage.message);
                }
                console.log("Change:");
                console.log(resultMessage.data);
                this.coinModule.printMachineCoins();
                break;
            }
            case 'coin': {
                const coinType = Parser.getCoinType(command);
                const resultMessage = this.coinModule.checkCoinAmount(coinType as number);
                console.log(resultMessage.result);
                if (resultMessage.result === ResultEnum.Error) {
                    console.error(resultMessage.message);
                }
                console.log(`Coin amount: ${resultMessage.data}`);
                break;
            }
            case 'print': {
                this.coinModule.printMachineCoins();
                break;
            }
            case 'reset': {
                this.coinModule.reset();
                break;
            }
            case 'help': {
                if (command.arguments.length === 0) {
                    CLI.printAllCommands();
                } else {
                    CLI.printCommand(command.arguments[0].name);
                }
                break;
            }
            case 'quit': {
                console.log('Closing Coin CLI...');
                process.exit(0);
            }
        }
    }
    static printCommand(commandName: string): void {
        const command = COMMAND_DICTIONARY[commandName];
        if (command) {
            console.log();
            console.log("NAME:");
            console.log(commandName);
            console.log("DESCRIPTION:");
            console.log(command.description);
            console.log("ARGUMENTS:");
            for (const argument of command.arguments) {
                console.log(`[--${argument.name} | -${argument.short}]`);
            }
        } else {
            console.error(`No such command ${commandName}!`);
        }
    }

    static printAllCommands(): void {
        console.log("To see help text, you can run:");
        console.log("help <command>");
        console.log("Available commands:");
        Object.keys(COMMAND_DICTIONARY).map((commandName) => {
            console.log(commandName);
        });
    }
}
