import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "..";
// import { Validators } from "../../validators";
import { Attempt } from "./Attempt";
import { Project } from "./Project";

@Entity()
export class Task extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100,
    })
    name: string;

    @Column({
        nullable: true
    })
    validator: string;

    @ManyToOne(() => Attempt, attempt => attempt.task)
    attempts: Promise<Attempt[]>;

    @ManyToOne(() => Project, project => project.tasks)
    project: Promise<Project>;

    @ManyToMany(() => Task, task => task.dependents)
    @JoinTable()
    depends: Promise<Task[]>;

    @ManyToMany(() => Task, task => task.depends)
    dependents: Promise<Task[]>;
}