import { Coin } from "../coin/coin.interface";
import { COMMAND_DICTIONARY } from "../cli/command-dictionary";
import { ParsedArgument, ParsedCommand } from "./parser.interface";
import { ArgumentDefinition } from "../cli/cli.interface";

export class Parser {
    static parse(inputString: string): ParsedCommand {
        try {
            const input = inputString.trim();
            const words = input.split(' ');
            const parsedCommand: ParsedCommand = {
                name: '',
                arguments: []
            };

            while (words.length > 0) {
                const word = words.shift();
                if (parsedCommand.name === '') {
                    if (!COMMAND_DICTIONARY[word]) {
                        throw new Error(`Invalid command ${word}!`);
                    }
                    parsedCommand.name = word;
                } else if (COMMAND_DICTIONARY[parsedCommand.name].numberOfArguments > 0) {
                    const argumentName = word.includes('--') ? word.replace('--', '') : word.replace('-', '');
                    const argument: ParsedArgument = {
                        name: argumentName,
                        value: null
                    };
                    if (parsedCommand.name === 'help' || parsedCommand.name === 'h') {
                        const value = words.shift();
                        argument.value = value;
                    } else {
                        const argumentDefinition = Parser.getArgumentDefinition(parsedCommand.name, word);
                        if (!argumentDefinition) {
                            throw new Error(`Invalid argument ${word} for command ${parsedCommand.name}!`);
                        }
                        const argumentWord = words.shift();
                        argument.value = Parser.checkArgumentType(parsedCommand.name, argumentDefinition, argumentWord);
                    }
                    const addedArgument = parsedCommand.arguments.find((commandArg) => commandArg.name === argument.name);
                    if (addedArgument) {
                        throw new Error(`Invalid argument type ${argument.name} duplicated for command ${parsedCommand.name}!`);
                    }
                    parsedCommand.arguments.push(argument);
                }
            }
            if (parsedCommand.arguments.length !== COMMAND_DICTIONARY[parsedCommand.name].numberOfArguments && !COMMAND_DICTIONARY[parsedCommand.name].argumentsOptional) {
                throw new Error(`Missing arguments for command ${parsedCommand.name}!`);
            }

            return parsedCommand;
        } catch (error) {
            console.error(error.message);
            return null;
        }

    }

    static getArgumentDefinition(commandName: string, word: string): ArgumentDefinition | undefined {
        return COMMAND_DICTIONARY[commandName].arguments.find((argument) => `--${argument.name}` === word || `-${argument.short}` === word);
    }

    static checkArgumentType(commandName: string, argumentDefinition: ArgumentDefinition, argumentWord: string): number | number[] {
        if (argumentDefinition.type === 'numberArray') {
            const values = argumentWord.split(',').map((w) => {
                const value = parseInt(w, 10);
                if (isNaN(value) || value < 0) {
                    throw new Error(`Invalid argument type ${argumentWord} for command ${commandName} argument ${argumentDefinition.name}!`);
                }
                return value;
            });
            return values;
        } else if (argumentDefinition.type === 'number') {
            const value = parseInt(argumentWord, 10);
            if (isNaN(value)) {
                throw new Error(`Invalid argument type ${argumentWord} for command ${commandName} argument ${argumentDefinition.name}!`);
            }
            return value;
        } else {
            throw new Error(`Invalid argument type ${argumentWord} for command ${commandName}!`);
        }
    }

    static getCoins(command: ParsedCommand): Coin[] {
        const coinTypes = command.arguments.find((argument) => argument.name === 'ct' || argument.name === 'coin-types')?.value as number[];
        const coinAmounts = command.arguments.find((argument) => argument.name === 'ca' || argument.name === 'coin-amounts')?.value as number[];
        const coins: Coin[] = [];
       for (let index = 0; index < coinTypes.length; index++) {
           coins.push({type: coinTypes[index], amount: coinAmounts[index]});
       }
       return coins;
    }

    static getAmount(command: ParsedCommand): number {
        return command.arguments.find((argument)=>argument.name === 'a' || argument.name === 'amount').value as number;
    }

    static getCoinType(command: ParsedCommand): number {
        return command.arguments.find((argument)=>argument.name === 't' || argument.name === 'type').value as number;
    }
}
