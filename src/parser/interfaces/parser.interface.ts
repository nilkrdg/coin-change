export interface ParsedArgument {
    name: string;
    value: number[] | number | string | null;
}
export interface ParsedCommand {
    name: string;
    arguments: ParsedArgument[]
}
