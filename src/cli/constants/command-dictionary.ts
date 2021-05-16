import { CommandDictionary } from "../interfaces/cli.interface";

export const COMMAND_DICTIONARY: CommandDictionary = {
    init: {
        description: `Init command initialises the machine storage with the given amount.
        Coin types indicate the value of the coin, the order of the coin types must match order of the coin amount!`,
        arguments: [{ name: 'coin-types', short: 'ct', type: 'numberArray' },
        { name: 'coin-amounts', short: 'ca', type: 'numberArray' }],
        numberOfArguments: 2,
        argumentsOptional: false
    },
    insert: {
        description: `Insert command is used to accept coins from a user.
        This amount will be used when a buy command is requested.
        Coin types indicate the value of the coin, the order of the coin types must match order of the coin amount!`,
        arguments: [{ name: 'coin-types', short: 'ct', type: 'numberArray' },
        { name: 'coin-amounts', short: 'ca', type: 'numberArray' }],
        numberOfArguments: 2,
        argumentsOptional: false
    },
    buy: {
        description: `Buy command returns the correct change and removes the coins from the machine.
        If Buy command fails all user coins will be returned.
        Amount indicates the value of a product.`,
        arguments: [{ name: 'amount', short: 'a', type: 'number' }],
        numberOfArguments: 1,
        argumentsOptional: false
    },
    coin: {
        description: `Returns the amount of the specified coin.`,
        arguments: [{ name: 'type', short: 't', type: 'number' }],
        numberOfArguments: 1,
        argumentsOptional: false
    },
    reset: {
        description: 'Resets all the API state.',
        arguments: [],
        numberOfArguments: 0,
        argumentsOptional: false,
    },
    print: {
        description: 'Prints all the coins in the machine.',
        arguments: [],
        numberOfArguments: 0,
        argumentsOptional: false,
    },
    quit: {
        description: 'Quit command closes the command line program.',
        arguments: [],
        numberOfArguments: 0,
        argumentsOptional: false,
    },
    help: {
        description: `Help command prints all available commands
        or the details of the given command if it is present as an argument.`,
        arguments: [],
        numberOfArguments: 1,
        argumentsOptional: true,

    }
}
