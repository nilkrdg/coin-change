import { CommandDictionary } from "./cli.interface";

export const COMMAND_DICTIONARY: CommandDictionary = {
    init: {
        description: `Init command initializes the machine storage with the given amount.\n
        Coin types indicate the value of the coin, the order of the coin types must match order of the coin amount!`,
        arguments: [{ name: 'coin-types', short: 'ct', type: 'numberArray' },
        { name: 'coin-amounts', short: 'ca', type: 'numberArray' }],
        numberOfArguments: 2,
        argumentsOptional: false
    },
    insert: {
        description: `Insert command is used to accept coins from a user. \n
        This amount will be used when a buy command is requested. \n
        Coin types indicate the value of the coin, the order of the coin types must match order of the coin amount!`,
        arguments: [{ name: 'coin-types', short: 'ct', type: 'numberArray' },
        { name: 'coin-amounts', short: 'ca', type: 'numberArray' }],
        numberOfArguments: 2,
        argumentsOptional: false
    },
    buy: {
        description: `Buy command returns the correct change and removes the coins from the machine. \n
        If Buy command fails all user coins will be returned. \n
        Amount indicates the value of a product.`,
        arguments: [{ name: 'amount', short: 'a', type: 'number' }],
        numberOfArguments: 1,
        argumentsOptional: false
    },
    quit: {
        description: 'Quit command closes the command line program.',
        arguments: [],
        numberOfArguments: 0,
        argumentsOptional: false,
    },
    q: {
        description: 'Short form of quit command closes the command line program.',
        arguments: [],
        numberOfArguments: 0,
        argumentsOptional: false,
    },
    help: {
        description: `Help command prints all available commands \n 
        or the details of the given command if it is present as an argument.`,
        arguments: [],
        numberOfArguments: 1,
        argumentsOptional: true,

    },
    h: {
        description: `Short form of Help command prints all available commands \n 
        or the details of the given command if it is present as an argument.`,
        arguments: [],
        numberOfArguments: 1,
        argumentsOptional: true,
    }
}
