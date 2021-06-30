import { Isolate } from "isolated-vm";
import { getManager, Not } from "typeorm";
import config from "./config";
import { Attempt, AttemptStates } from "./models/project/Attempt";
import { ValidatorTask } from "./models/views";

export type ScriptResult = {
    logs: string[];
    result: boolean,
    error: Error | null;
};

export async function runAttemptsValidation() {
    const _validator_task = await getManager().findOne(ValidatorTask, {
        where: {
            state: AttemptStates.PendingAutoChecking,
            script: Not(null)
        }
    });

    if (_validator_task) {
        const { result, error } = await runScript(_validator_task.script, {
            "data": _validator_task.data,
            "base": _validator_task.base,
            "variant": _validator_task.variant,
        });

        await Attempt.update({
            id: _validator_task.id,
        }, {
            state: AttemptStates.AutoChecked,
            error: error?.message,
            is_correct: result,
        });
    }
}

export async function runScript(code: string, vars: Object): Promise<ScriptResult> {
    let _result: boolean = false;
    let _logs: string[] = [];
    let _error: Error = null;

    const env = new Isolate();

    const context = await env.createContext();

    const globals = context.global;

    for (const key in vars)
        await globals.set(key.toUpperCase(), vars[key]);

    await globals.set("setResult", function (result: boolean) {
        _result = !!result;
    });

    await globals.set("log", function (message: string) {
        _logs.push(message);
    });

    const script = await env.compileScript(code);

    await script.run(context, {
        promise: true,
        timeout: config.validator.timeout,
    }).catch((error) => {
        _error = error;
    });;

    if (!env.isDisposed)
        env.dispose();

    return {
        "logs": _logs,
        "result": _result,
        "error": _error
    };
}