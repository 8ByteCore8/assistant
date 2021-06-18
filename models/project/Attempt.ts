import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "..";
import { User } from "../account/User";
import { Task } from "./Task";
import { UserTask } from "./UserTask";

export enum AttemptStates {
    PendingAutomaticChecking,
    PendingChecking,
    Checked,
}

@Entity()
export class Attempt extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Task)
    task: Task;

    user_task:UserTask

    @Column()
    answer: string;

    @Column()
    state: AttemptStates;
}