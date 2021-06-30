import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "..";
import { Task } from "./Task";

@Entity({
    name: "validators",
})
export default class Validator extends Model {

    @PrimaryGeneratedColumn({
        name: "id",
    })
    id: number;

    @Column({
        name: "script",
        length: 20000
    })
    script: string;

    @Column({
        length: 100,
    })
    name: string;

    @OneToMany(() => Task, task => task.validator, {
        primary: true
    })
    tasks: Promise<Task[]>;
}