import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "..";
import { User } from "../account/User";
import { Task } from "./Task";

export enum AttemptStates {
    PendingAutomaticChecking,
    PendingChecking,
    Checked,
}

@Entity()
export class Attempt extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Task, task => task.attempts)
    task: Promise<Task>;

    @ManyToOne(() => User, user => user.attempts)
    user: Promise<User>;

    @Column()
    answer: string;

    @Column()
    mark: number;

    @Column()
    state: AttemptStates;
}