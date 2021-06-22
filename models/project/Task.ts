import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "..";
import { User } from "../account/User";
import { Attempt } from "./Attempt";
import { Project } from "./Project";

@Entity({
    name: "tasks",
    orderBy: {
        project: "ASC",
        name: "ASC",
    }
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

    @Column({
        name: "validator",
        nullable: true,
        length: 50,
    })
    validator: string;

    @ManyToOne(() => Project, project => project.tasks)
    project: Promise<Project>;

    static async get_attempts(task: Task, user?: User) {
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