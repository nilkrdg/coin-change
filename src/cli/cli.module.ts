import { ResultEnum } from "../coin/coin.interface";
import { CoinModule } from "../coin/coin.module";
import { ParsedCommand } from "../parser/parser.interface";
import { Parser } from "../parser/parser.module";

export class CLI {
    private coinModule = new CoinModule();

    public executeCommand(commandString: string): void {
        const command = Parser.parse(commandString);
        switch (command.name) {
            case 'init': {
                const coins = Parser.getCoins(command);
                const resultMessage = this.coinModule.initialiseMachine(coins);
                console.log(resultMessage.result);
                this.coinModule.printMachineCoins();
            }
                break;
            case 'insert': {
                const coins = Parser.getCoins(command);
                const resultMessage = this.coinModule.registerUserCoins(coins);
                console.log(resultMessage.result);
                this.coinModule.printMachineCoins();
            }
                break;
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
            }
                break;
            case 'help': {
                if (command.arguments.length === 0) {
                    Parser.printAllCommands();
                } else {
                    Parser.printCommand(command.arguments[0].name);
                }
            }
                break;
        }
    }
}
