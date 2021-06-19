import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @ManyToOne(() => Task)
    task: Promise<Task>;

    @ManyToOne(() => User)
    user: Promise<User>;

    @Column({
        length: 2000,
    })
    data: string;

    @Column({
        nullable: true
    })
    is_correct: boolean;

    @Column()
    state: AttemptStates;
}