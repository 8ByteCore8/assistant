import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "..";
import { User } from "../account/User";
import { Task } from "./Task";

export enum AttemptStates {
    PendingAutoChecking,
    PendingChecking,
    AutoChecked,
    Checked,
}

@Entity({
    name: "attempts"
})
export class Attempt extends Model {
    @PrimaryGeneratedColumn({
        name: "id",
    })
    id: number;

    @ManyToOne(() => Task)
    task: Promise<Task>;

    @ManyToOne(() => User)
    user: Promise<User>;

    @Column({
        name: "data",
        length: 2000,
    })
    data: string;

    @Column({
        name: "is_correct",
        nullable: true
    })
    is_correct: boolean;

    @Column({
        name: "state",
    })
    state: AttemptStates;

    @Column({
        name: "error",
        length: 255,
        nullable: true,
    })
    error: string;

    @ManyToOne(() => Attempt)
    base: Promise<Attempt>;
}