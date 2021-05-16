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
