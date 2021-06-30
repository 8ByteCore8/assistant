import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "..";
import { User } from "../account/User";
import { Attempt } from "./Attempt";
import { Project } from "./Project";
import Validator from "./Validator";

@Entity({
    name: "tasks",
})
export class Task extends Model {
    @PrimaryGeneratedColumn({
        name: "id",
    })
    id: number;

    @Column({
        name: "name",
        length: 100,
    })
    name: string;

    @Column({
        name: "description",
        length: 2000,
    })
    description: string;

    @ManyToOne(() => Validator, validator => validator.tasks)
    validator: Promise<Validator>;

    @ManyToOne(() => Project, project => project.tasks)
    project: Promise<Project>;

    @ManyToOne(() => Task, {
        nullable: true,
    })
    base: Promise<Task>;

    static async find_attempts(task: Task, user?: User) {
        return await Attempt.find({
            where: {
                task: task,
                user: user
            },
            order: {
                created_at: "DESC"
            },

            cache: true
        });
    }
}