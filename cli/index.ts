import { createInterface } from "readline";

export const cli = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});