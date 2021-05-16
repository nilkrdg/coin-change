
import { CLI } from "./src/cli/cli.module";

console.log('Welcome to Coin Change CLI!');
const cli = new CLI();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (inputBuffer: string) => {
    cli.executeCommand(inputBuffer);
});

