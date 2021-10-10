
import readline from "readline"

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

import { promisify } from 'util';

export const getLine = (function () {
    const getLineGen = (async function* () {
        for await (const line of rl) {
            yield line;
        }
    })();
    return async () => ((await getLineGen.next()).value);
})();



export const question = promisify(rl.question).bind(rl);

export function clearTerminal() {
    process.stdout.write(`\x1Bc`);
}

export async function askYNQuestion(q: string): Promise<string> {
    let answer = ""
    while (answer === "") {
        const tempAnswer = await question(q);
        if (tempAnswer !== "y" && tempAnswer !== "n") {
            console.log("please enter y / n only")
        } else {
            answer = tempAnswer
        }
    }
    return answer;
}
export async function askQuestion(q: string): Promise<string> {
    return question(q);
}


