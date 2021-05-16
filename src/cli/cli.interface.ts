export interface ParsedArgument {
    name: string;
    value: number[] | number | string | null;
}
export interface ParsedCommand {
    name: string;
    arguments: ParsedArgument[]
}

export interface ArgumentDefinition {
    name: string;
    short: string;
    type: 'numberArray' | 'number' | 'string';
}

export interface CommandDefinition {
    arguments: ArgumentDefinition[];
    description: string;
    numberOfArguments: number;
    short?: string;
    argumentsOptional: boolean;
}

export interface CommandDictionary {
    [commandName: string]: CommandDefinition;
}
