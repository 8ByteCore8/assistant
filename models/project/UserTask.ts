import { Entity, ManyToOne, OneToMany } from "typeorm";
import { Model } from "..";
import { User } from "../account/User";
// import { Validators } from "../../validators";
import { Attempt } from "./Attempt";
import { Task } from "./Task";

@Entity()
export class UserTask extends Model {

    @ManyToOne(() => User, {
        primary: true
    })
    task: Task;

    @ManyToOne(() => User, {
        primary: true
    })
    user: User;

    @OneToMany(() => Attempt, attempt => attempt.task)
    attempts: Attempt[];
}