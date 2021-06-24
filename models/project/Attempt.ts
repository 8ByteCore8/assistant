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
    name: "attempts",
    orderBy: {
        user: "ASC",
        task: "ASC",
    }
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
        name: "validator",
        nullable: true,
        length: 50,
    })
    validator: string;

    @Column({
        name: "state",
    })
    state: AttemptStates;

    @BeforeInsert()
    beforeInsert() {
        this.state = this.validator ? AttemptStates.PendingAutoChecking : AttemptStates.PendingChecking;
    }
}