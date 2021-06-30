import { Connection, ViewColumn, ViewEntity } from "typeorm";
import { User } from "./account/User";
import { Attempt, AttemptStates } from "./project/Attempt";
import { Project } from "./project/Project";
import { Task } from "./project/Task";
import Validator from "./project/Validator";
import Variant from "./project/Variant";


@ViewEntity({
    name: "validator_task",
    expression: (connection: Connection) => connection.createQueryBuilder()
        .select("attempt.id", "id")
        .addSelect("attempt.state", "state")
        .addSelect("variant.data", "variant_data")
        .addSelect("base.data", "base_data")
        .addSelect("attempt.data", "data")
        .addSelect("validator.script", "script")
        .from(Attempt, "attempt")

        .leftJoin(User, "user", "user.id = attempt.userId")
        .leftJoin(Task, "task", "task.id = attempt.taskId")
        .leftJoin(Project, "project", "project.id = task.projectId")
        .leftJoin(Variant, "variant", "variant.userId = user.id AND variant.projectId = project.id")
        .leftJoin(Attempt, "base", "base.id = attempt.baseId")
        .leftJoin(Validator, "validator", "validator.id = task.validatorId")

        .where(`attempt.state = ${AttemptStates.PendingAutoChecking}`),
})
export class ValidatorTask {

    @ViewColumn({
        name: "id"
    })
    id: number;

    @ViewColumn({
        name: "state"
    })
    state: AttemptStates;

    @ViewColumn({
        name: "variant_data"
    })
    variant: string;

    @ViewColumn({
        name: "base_data"
    })
    base: string;

    @ViewColumn({
        name: "data"
    })
    data: string;

    @ViewColumn({
        name: "script"
    })
    script: string;
}